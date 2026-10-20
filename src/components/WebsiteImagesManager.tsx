import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon, Upload, RefreshCw, Eye, Check, X,
  Save, RotateCcw, AlertCircle, CheckCircle2, Sliders,
  Monitor, Tablet, Smartphone, Maximize2, Trash2, ExternalLink
} from 'lucide-react';
import type { CMSImageSlot } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

interface WebsiteImagesManagerProps {
  token: string;
  onRefresh?: () => void;
}

export const WebsiteImagesManager: React.FC<WebsiteImagesManagerProps> = ({ token, onRefresh }) => {
  const { refreshContent } = useSiteContent();
  const [slots, setSlots] = useState<CMSImageSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPage, setFilterPage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<CMSImageSlot | null>(null);
  const [editingSlot, setEditingSlot] = useState<CMSImageSlot | null>(null);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTargetField, setActiveTargetField] = useState<'currentUrl' | 'desktopUrl' | 'tabletUrl' | 'mobileUrl'>('currentUrl');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content/images', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSlots(data.images || []);
      } else {
        // Fallback to /api/admin/content
        const altRes = await fetch('/api/admin/content', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (altRes.ok) {
          const altData = await altRes.json();
          setSlots(altData.siteContent?.websiteImages || []);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load image slots', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [token]);

  const handleSaveSlot = async (slotToSave: CMSImageSlot) => {
    setSavingId(slotToSave.id);
    try {
      const res = await fetch(`/api/admin/content/images/${slotToSave.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(slotToSave)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save image changes');

      // Update state
      setSlots(prev => prev.map(s => s.id === slotToSave.id ? data.slot : s));
      if (editingSlot && editingSlot.id === slotToSave.id) {
        setEditingSlot(data.slot);
      }
      showToast(`Image "${slotToSave.title}" updated and published live.`);
      if (onRefresh) onRefresh();
      refreshContent();
    } catch (err: any) {
      showToast(err.message || 'Failed to save image slot', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleRestoreSlot = async (slotId: string) => {
    setSavingId(slotId);
    try {
      const res = await fetch(`/api/admin/content/images/${slotId}/restore`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No previous image to restore');

      setSlots(prev => prev.map(s => s.id === slotId ? data.slot : s));
      if (editingSlot && editingSlot.id === slotId) {
        setEditingSlot(data.slot);
      }
      showToast('Previous image version restored successfully.');
      if (onRefresh) onRefresh();
      refreshContent();
    } catch (err: any) {
      showToast(err.message || 'Failed to restore previous image', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleFileUpload = async (file: File, slotId: string, targetField: 'currentUrl' | 'desktopUrl' | 'tabletUrl' | 'mobileUrl') => {
    // Validate file type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      showToast('Invalid file format. Please upload JPG, PNG, WebP or SVG only.', 'error');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      showToast('File exceeds 8 MB upload limit. Please optimize image before uploading.', 'error');
      return;
    }

    setUploadingForId(slotId);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              dataUrl: reader.result as string,
              filename: file.name
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to upload creative asset');

          const targetSlot = slots.find(s => s.id === slotId);
          if (targetSlot) {
            const updated = {
              ...targetSlot,
              [targetField]: data.url,
              currentUrl: targetField === 'currentUrl' || !targetSlot.currentUrl ? data.url : targetSlot.currentUrl
            };
            await handleSaveSlot(updated);
          }
        } catch (uploadErr: any) {
          showToast(uploadErr.message || 'Upload failed', 'error');
        } finally {
          setUploadingForId(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast(err.message || 'File read error', 'error');
      setUploadingForId(null);
    }
  };

  const filteredSlots = slots.filter(slot => {
    const matchesPage = filterPage === 'all' || slot.page === filterPage;
    const matchesSearch = !searchQuery.trim() ||
      slot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.page.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPage && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold transition-all ${
            feedback.type === 'success'
              ? 'bg-[#173B75] text-white border border-[#F07822]'
              : 'bg-red-900 text-white border border-red-500'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#F07822]" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#FFF9F1] p-6 sm:p-8 rounded-3xl border border-[#E4D8C8] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173B75]/10 text-[#173B75] text-xs font-bold uppercase tracking-wider mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-[#F07822]" />
            Website Images & Banners Manager
          </div>
          <h2 className="text-2xl font-black text-[#173B75]">
            Complete Website Visual Asset Inventory
          </h2>
          <p className="text-xs sm:text-sm text-[#252A34]/70 max-w-2xl mt-1">
            Every image, banner, background, card visual, and logo slot on the Good Folk Solution website is mapped below with verified layout specifications, responsive breakpoints, and focal-point positioning.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchSlots}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-[#E4D8C8] bg-white hover:bg-[#E8EFF8] text-xs font-bold text-[#173B75] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload Slots</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Page Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: `All (${slots.length})` },
            { id: 'home', label: 'Home' },
            { id: 'services', label: 'Services' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'about', label: 'About Us' },
            { id: 'contact', label: 'Contact' },
            { id: 'global', label: 'Global / Header / QR' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterPage(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterPage === tab.id
                  ? 'bg-[#173B75] text-white shadow-sm'
                  : 'bg-white text-[#252A34]/70 border border-[#E4D8C8] hover:bg-[#FFF9F1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search image slot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-[#E4D8C8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#173B75]"
          />
        </div>
      </div>

      {/* Slots Grid */}
      {loading ? (
        <div className="p-16 text-center text-sm font-semibold text-[#173B75] flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#F07822]" />
          <span>Scanning website image slots...</span>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#E4D8C8] text-[#252A34]/60">
          <ImageIcon className="w-10 h-10 mx-auto text-[#252A34]/30 mb-3" />
          <p className="text-sm font-semibold">No image slots matched your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlots.map(slot => {
            const isSaving = savingId === slot.id;
            const isUploading = uploadingForId === slot.id;

            return (
              <div
                key={slot.id}
                className="bg-white rounded-3xl border border-[#E4D8C8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image Preview with Focal Point & Badges */}
                <div className="relative bg-[#252A34] h-48 overflow-hidden group">
                  {slot.currentUrl ? (
                    <img
                      src={slot.currentUrl}
                      alt={slot.altText || slot.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: slot.focalPoint || 'center' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/50 text-xs">
                      <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                      <span>SVG Default in Code</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Page & Section Badge */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#173B75]/90 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs">
                      {slot.page}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white/90 text-[10px] backdrop-blur-xs">
                      {slot.section}
                    </span>
                  </div>

                  {/* Focal Point Indicator */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/90 text-[#173B75] text-[10px] font-bold">
                    Focal: {slot.focalPoint || 'center'}
                  </div>

                  {/* Bottom Image Spec Details */}
                  <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] flex items-center justify-between">
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded">
                      Rec: {slot.recommendedDimensions}
                    </span>
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded">
                      Ratio: {slot.aspectRatio}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-[#173B75] leading-snug">
                      {slot.title}
                    </h3>

                    {/* Meta Specifications */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#252A34]/70 bg-[#FFF9F1] p-3 rounded-2xl border border-[#E4D8C8]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#252A34]/50 block">Max Size</span>
                        <span className="font-semibold text-[#173B75]">{slot.maxSize}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#252A34]/50 block">Formats</span>
                        <span className="font-semibold text-[#173B75]">{slot.formats.join(', ')}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase font-bold text-[#252A34]/50 block">Alt Text</span>
                        <span className="truncate block font-medium" title={slot.altText}>{slot.altText || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-[#E4D8C8]">
                    <div className="flex items-center gap-2">
                      {/* Direct Upload button */}
                      <label className="flex-1 bg-[#173B75] hover:bg-[#123163] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-[#F07822]" />
                        <span>{isUploading ? 'Uploading...' : 'Upload & Replace'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/svg+xml"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, slot.id, 'currentUrl');
                          }}
                        />
                      </label>

                      {/* Customize & Settings */}
                      <button
                        onClick={() => setEditingSlot({ ...slot })}
                        className="p-2 rounded-xl border border-[#E4D8C8] bg-white hover:bg-[#FFF9F1] text-[#173B75] transition-colors cursor-pointer"
                        title="Configure focal point, mobile/tablet variants and alt text"
                      >
                        <Sliders className="w-4 h-4 text-[#F07822]" />
                      </button>

                      {/* Restore Previous */}
                      {slot.previousUrl && (
                        <button
                          onClick={() => handleRestoreSlot(slot.id)}
                          disabled={isSaving}
                          className="p-2 rounded-xl border border-[#E4D8C8] bg-white hover:bg-amber-50 text-amber-700 transition-colors cursor-pointer"
                          title="Restore previous image"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Responsive Variants Indicators */}
                    <div className="flex items-center justify-between text-[10px] text-[#252A34]/60 px-1 pt-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-0.5 ${slot.desktopUrl ? 'text-[#173B75] font-bold' : 'opacity-40'}`}>
                          <Monitor className="w-3 h-3" /> Desktop
                        </span>
                        <span className={`inline-flex items-center gap-0.5 ${slot.tabletUrl ? 'text-[#173B75] font-bold' : 'opacity-40'}`}>
                          <Tablet className="w-3 h-3" /> Tablet
                        </span>
                        <span className={`inline-flex items-center gap-0.5 ${slot.mobileUrl ? 'text-[#173B75] font-bold' : 'opacity-40'}`}>
                          <Smartphone className="w-3 h-3" /> Mobile
                        </span>
                      </div>
                      {slot.previousUrl && (
                        <span className="text-amber-700 font-semibold text-[10px]">Version available</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT MODAL FOR DETAILED SETTINGS */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E4D8C8]">
            <div className="flex items-center justify-between border-b border-[#E4D8C8] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F07822]">
                  {editingSlot.page} · {editingSlot.section}
                </span>
                <h3 className="text-xl font-black text-[#173B75]">
                  Edit Slot: {editingSlot.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingSlot(null)}
                className="p-2 rounded-xl text-[#252A34]/50 hover:bg-[#FFF9F1] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive Viewport Preview Switcher */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173B75]">Interactive Preview Simulation</span>
                <div className="flex items-center gap-1 bg-[#FFF9F1] p-1 rounded-xl border border-[#E4D8C8]">
                  <button
                    onClick={() => setPreviewViewport('desktop')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      previewViewport === 'desktop' ? 'bg-[#173B75] text-white' : 'text-[#252A34]/70'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop
                  </button>
                  <button
                    onClick={() => setPreviewViewport('tablet')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      previewViewport === 'tablet' ? 'bg-[#173B75] text-white' : 'text-[#252A34]/70'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" /> Tablet
                  </button>
                  <button
                    onClick={() => setPreviewViewport('mobile')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      previewViewport === 'mobile' ? 'bg-[#173B75] text-white' : 'text-[#252A34]/70'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </button>
                </div>
              </div>

              {/* Simulated Container */}
              <div className="bg-[#252A34] p-4 rounded-2xl flex items-center justify-center overflow-hidden">
                <div
                  className={`transition-all duration-300 relative rounded-xl overflow-hidden shadow-lg ${
                    previewViewport === 'mobile'
                      ? 'w-[260px] h-[360px]'
                      : previewViewport === 'tablet'
                      ? 'w-[420px] h-[280px]'
                      : 'w-full h-[260px]'
                  }`}
                >
                  <img
                    src={
                      (previewViewport === 'mobile' && editingSlot.mobileUrl) ||
                      (previewViewport === 'tablet' && editingSlot.tabletUrl) ||
                      editingSlot.currentUrl
                    }
                    alt={editingSlot.altText}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: editingSlot.focalPoint || 'center' }}
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    {previewViewport === 'mobile' ? 'Mobile 375px' : previewViewport === 'tablet' ? 'Tablet 768px' : 'Desktop 1920px'}
                  </div>
                </div>
              </div>
            </div>

            {/* Image URLs & Variants */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
                Image Asset URLs & Responsive Breakpoints
              </h4>

              {/* Main Desktop Image */}
              <div>
                <label className="text-xs font-bold text-[#252A34] block mb-1">
                  Primary / Desktop Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingSlot.currentUrl}
                    onChange={(e) => setEditingSlot({ ...editingSlot, currentUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-[#E4D8C8] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#173B75]"
                    placeholder="https://..."
                  />
                  <label className="bg-[#173B75] hover:bg-[#123163] text-white text-xs font-bold px-3 py-2.5 rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#F07822]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, editingSlot.id, 'currentUrl');
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Tablet Variant */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#252A34] block mb-1">
                    Tablet Variant URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSlot.tabletUrl || ''}
                    onChange={(e) => setEditingSlot({ ...editingSlot, tabletUrl: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-[#E4D8C8] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#173B75]"
                    placeholder="Optional tablet crop..."
                  />
                </div>

                {/* Mobile Variant */}
                <div>
                  <label className="text-xs font-bold text-[#252A34] block mb-1">
                    Mobile Variant URL (Optional, 750 × 1100 px)
                  </label>
                  <input
                    type="text"
                    value={editingSlot.mobileUrl || ''}
                    onChange={(e) => setEditingSlot({ ...editingSlot, mobileUrl: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-[#E4D8C8] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#173B75]"
                    placeholder="Optional vertical crop..."
                  />
                </div>
              </div>
            </div>

            {/* Focal Point & Alt Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E4D8C8]">
              {/* Focal Point */}
              <div>
                <label className="text-xs font-bold text-[#252A34] block mb-1">
                  Focal Point Positioning
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['center', 'top', 'bottom', 'left', 'right'] as const).map(focal => (
                    <button
                      key={focal}
                      type="button"
                      onClick={() => setEditingSlot({ ...editingSlot, focalPoint: focal })}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border capitalize cursor-pointer transition-colors ${
                        (editingSlot.focalPoint || 'center') === focal
                          ? 'bg-[#173B75] text-white border-[#173B75]'
                          : 'bg-white text-[#252A34]/70 border-[#E4D8C8] hover:bg-[#FFF9F1]'
                      }`}
                    >
                      {focal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="text-xs font-bold text-[#252A34] block mb-1">
                  Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={editingSlot.altText}
                  onChange={(e) => setEditingSlot({ ...editingSlot, altText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-[#E4D8C8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#173B75]"
                  placeholder="Describe image clearly..."
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E4D8C8]">
              {editingSlot.previousUrl ? (
                <button
                  type="button"
                  onClick={() => handleRestoreSlot(editingSlot.id)}
                  className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Previous Image</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E4D8C8] text-xs font-semibold hover:bg-[#FFF9F1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSlot(editingSlot)}
                  disabled={savingId === editingSlot.id}
                  className="px-6 py-2.5 rounded-xl bg-[#F07822] hover:bg-[#d66515] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingId === editingSlot.id ? 'Publishing...' : 'Save & Publish Live'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
