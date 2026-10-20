import React, { useState, useRef } from 'react';
import {
  Upload, Image as ImageIcon, Trash2, Eye, Sparkles, Check,
  Save, RefreshCw, AlertCircle, CheckCircle2, ExternalLink,
  Sliders, Monitor, Tablet, Smartphone, Move, Compass, ArrowRight
} from 'lucide-react';
import type { CMSSiteContent, CMSServicesBanner, MediaItem } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

interface ServicesBannerManagerProps {
  token: string;
  siteContent: CMSSiteContent;
  mediaLibrary: MediaItem[];
  onUpdateSiteContent: (updated: CMSSiteContent) => void;
  onRefresh?: () => void;
}

export const ServicesBannerManager: React.FC<ServicesBannerManagerProps> = ({
  token,
  siteContent,
  mediaLibrary,
  onUpdateSiteContent,
  onRefresh
}) => {
  const { refreshContent } = useSiteContent();

  const currentBanner: CMSServicesBanner = siteContent.servicesBanner || {
    enabled: true,
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=2000&q=85',
    heading: 'Where Bold Strategy Meets Relentless Creative Craft.',
    subheading: 'From packaging dielines to performance ad creative, we design campaign assets that command attention and drive commercial results.',
    ctaLabel: 'Discuss Your Brief',
    ctaDestination: '#branding',
    focalPoint: 'center',
    badge: 'Creative Direction & Campaign Art',
    isDraft: false,
    updatedAt: new Date().toISOString()
  };

  const [banner, setBanner] = useState<CMSServicesBanner>(currentBanner);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (field: keyof CMSServicesBanner, value: any) => {
    setBanner(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Upload new image from local disk
  const handleFileUpload = async (file: File) => {
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      showNotification('Invalid file format. Upload JPG, PNG, WebP or SVG only.', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showNotification('File exceeds 8MB limit. Please upload a smaller image.', 'error');
      return;
    }

    setUploading(true);
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
          if (!res.ok) throw new Error(data.error || 'Failed to upload image');

          handleChange('imageUrl', data.url);
          showNotification('Banner image uploaded successfully!');
        } catch (err: any) {
          showNotification(err.message || 'Image upload failed', 'error');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showNotification('Could not read file', 'error');
      setUploading(false);
    }
  };

  // Remove banner image (resets to agency studio collage)
  const handleRemoveImage = () => {
    handleChange('imageUrl', '');
    showNotification('Banner image removed. Studio creative collage will be shown.');
  };

  // Save as Draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const updatedBanner: CMSServicesBanner = {
        ...banner,
        isDraft: true,
        updatedAt: new Date().toISOString()
      };
      const updatedSite: CMSSiteContent = {
        ...siteContent,
        servicesBanner: updatedBanner
      };

      const res = await fetch('/api/admin/content/site', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedSite)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save draft');

      onUpdateSiteContent(data.siteContent);
      setBanner(updatedBanner);
      showNotification('Services banner draft saved successfully.');
    } catch (err: any) {
      showNotification(err.message || 'Failed to save draft', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Publish Changes Live
  const handlePublishLive = async () => {
    setPublishing(true);
    try {
      const updatedBanner: CMSServicesBanner = {
        ...banner,
        isDraft: false,
        updatedAt: new Date().toISOString()
      };
      const updatedSite: CMSSiteContent = {
        ...siteContent,
        servicesBanner: updatedBanner
      };

      const res = await fetch('/api/admin/content/site', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedSite)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish changes');

      onUpdateSiteContent(data.siteContent);
      setBanner(updatedBanner);
      if (onRefresh) onRefresh();
      await refreshContent();
      showNotification('Services creative banner published live to Services page!');
    } catch (err: any) {
      showNotification(err.message || 'Failed to publish live', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const focalPointClass = {
    center: 'object-center',
    top: 'object-top',
    bottom: 'object-bottom',
    left: 'object-left',
    right: 'object-right'
  }[banner.focalPoint || 'center'] || 'object-center';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast */}
      {toast && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold ${
          toast.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F9] text-[#173B75] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F07822]" />
            Services Page Creative Banner
          </div>
          <h2 className="text-xl font-black text-[#173B75]">Advertising-Agency Creative Banner Manager</h2>
          <p className="text-xs text-[#242832]/75 mt-1 max-w-2xl leading-relaxed">
            Positioned immediately after the service navigation links and before the Creative Capabilities section.
            Control the campaign artwork, headline, copy, CTA destination, and image focal point.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.open('/services', '_blank')}
            className="px-3.5 py-2.5 rounded-xl border border-[#E6E8ED] bg-[#F7F7F5] hover:bg-[#EEF2F9] text-[#173B75] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F07822]" />
            <span>View Live Services Page</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#173B75]/30 hover:bg-[#F7F7F5] text-[#173B75] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handlePublishLive}
            disabled={publishing}
            className="px-5 py-2.5 rounded-xl bg-[#F07822] hover:bg-[#d65805] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{publishing ? 'Publishing...' : 'Publish Changes Live'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Image Management Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E6E8ED] pb-3">
              <h3 className="text-sm font-bold text-[#173B75] uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#F07822]" />
                <span>Banner Artwork & Image</span>
              </h3>
              {banner.imageUrl ? (
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                  Custom Image Active
                </span>
              ) : (
                <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                  Studio Dynamic Collage Active
                </span>
              )}
            </div>

            {/* Current Image Preview Thumbnail */}
            {banner.imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#E6E8ED] bg-slate-900 aspect-[16/9] group">
                <img
                  src={banner.imageUrl}
                  alt="Services Banner"
                  className={`w-full h-full object-cover ${focalPointClass}`}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white text-[#173B75] text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#F07822]" />
                    <span>Replace Image</span>
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-dashed border-[#E6E8ED] text-center space-y-2">
                <p className="text-xs text-[#242832]/70 font-medium">
                  No custom image uploaded. The banner is displaying the built-in art-directed advertising-agency dynamic collage.
                </p>
              </div>
            )}

            {/* Upload & Choose Controls */}
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                accept="image/*"
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="py-2.5 px-3 rounded-xl bg-[#EEF2F9] text-xs font-bold text-[#173B75] hover:bg-[#173B75] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-[#F07822]" />
                  <span>{uploading ? 'Uploading...' : 'Upload From Device'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className="py-2.5 px-3 rounded-xl border border-[#E6E8ED] bg-[#F7F7F5] text-xs font-bold text-[#173B75] hover:bg-[#EEF2F9] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-[#F07822]" />
                  <span>Media Library ({mediaLibrary.length})</span>
                </button>
              </div>

              {/* Direct URL Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                  Or Paste Image URL directly
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={banner.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-mono"
                  />
                  {banner.imageUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Media Picker Drawer */}
              {showMediaPicker && (
                <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E6E8ED] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#173B75]">
                    <span>Select from Uploaded Media</span>
                    <button onClick={() => setShowMediaPicker(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  {mediaLibrary.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No media uploaded yet. Use "Upload From Device" above.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                      {mediaLibrary.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            handleChange('imageUrl', item.url);
                            setShowMediaPicker(false);
                            showNotification('Image selected from media library.');
                          }}
                          className="aspect-square rounded-lg overflow-hidden border border-[#E6E8ED] hover:border-[#F07822] cursor-pointer relative group bg-white"
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Focal Point Positioning Selector */}
            <div className="pt-2 border-t border-[#E6E8ED]">
              <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1.5 flex items-center justify-between">
                <span>Image Focal Point / Positioning</span>
                <span className="text-[10px] text-gray-500 font-mono">Current: {banner.focalPoint || 'center'}</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['center', 'top', 'bottom', 'left', 'right'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => handleChange('focalPoint', pos)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      banner.focalPoint === pos
                        ? 'bg-[#173B75] text-white shadow-xs'
                        : 'bg-[#F7F7F5] text-[#173B75] border border-[#E6E8ED] hover:bg-[#EEF2F9]'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Banner Content & Typography Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#173B75] uppercase tracking-wider flex items-center gap-2 border-b border-[#E6E8ED] pb-3">
              <Sliders className="w-4 h-4 text-[#F07822]" />
              <span>Headings & Copy</span>
            </h3>

            {/* Badge */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                Badge / Supertitle
              </label>
              <input
                type="text"
                value={banner.badge || ''}
                onChange={(e) => handleChange('badge', e.target.value)}
                placeholder="Creative Direction & Campaign Art"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-bold"
              />
            </div>

            {/* Main Headline */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                Main Banner Heading *
              </label>
              <input
                type="text"
                value={banner.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="Where Bold Strategy Meets Relentless Creative Craft."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-extrabold text-[#173B75]"
              />
            </div>

            {/* Supporting Subheadline */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                Supporting Subheadline / Text
              </label>
              <textarea
                rows={3}
                value={banner.subheading || ''}
                onChange={(e) => handleChange('subheading', e.target.value)}
                placeholder="From packaging dielines to performance ad creative, we design campaign assets that command attention and drive commercial results."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] leading-relaxed"
              />
            </div>

            {/* CTA Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E6E8ED]">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={banner.ctaLabel || ''}
                  onChange={(e) => handleChange('ctaLabel', e.target.value)}
                  placeholder="Discuss Your Brief"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-bold text-[#F07822]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                  CTA Destination Link
                </label>
                <input
                  type="text"
                  value={banner.ctaDestination || ''}
                  onChange={(e) => handleChange('ctaDestination', e.target.value)}
                  placeholder="lets-talk or #branding or /contact"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-mono"
                />
              </div>
            </div>

            {/* Quick Destination Presets */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#242832]/60 mb-1">
                Quick Destination Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Let's Talk Modal", target: 'lets-talk' },
                  { label: 'Branding & Packaging', target: '#branding' },
                  { label: 'Creative Design', target: '#creative' },
                  { label: 'Performance Ads', target: '#performance' },
                  { label: 'Video Production', target: '#video' },
                  { label: 'Social Media', target: '#digital' },
                  { label: 'Contact Page', target: '/contact' }
                ].map((preset) => (
                  <button
                    key={preset.target}
                    type="button"
                    onClick={() => handleChange('ctaDestination', preset.target)}
                    className="px-2.5 py-1 rounded-lg bg-[#EEF2F9] text-[10px] font-semibold text-[#173B75] hover:bg-[#173B75] hover:text-white transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Device Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E8ED] pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#F07822]" />
                <h3 className="text-sm font-bold text-[#173B75] uppercase tracking-wider">
                  Live Responsive Preview
                </h3>
              </div>

              {/* Viewport Switcher */}
              <div className="flex items-center gap-1 bg-[#F7F7F5] p-1 rounded-xl border border-[#E6E8ED]">
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewViewport === 'desktop' ? 'bg-[#173B75] text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewViewport === 'tablet' ? 'bg-[#173B75] text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewViewport === 'mobile' ? 'bg-[#173B75] text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Preview Frame Container */}
            <div className="bg-[#EEF2F9] p-4 rounded-2xl flex justify-center overflow-x-auto">
              <div
                className={`transition-all duration-300 ${
                  previewViewport === 'desktop'
                    ? 'w-full'
                    : previewViewport === 'tablet'
                    ? 'w-[480px]'
                    : 'w-[320px]'
                }`}
              >
                {/* Scaled Banner Preview Box */}
                <div className="relative rounded-2xl overflow-hidden bg-[#0A1628] text-white border border-[#2458A6]/40 shadow-xl p-5 sm:p-6">
                  {/* Ambient Glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#F07822]/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#2458A6]/30 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 space-y-3 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-white uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
                      <span>{banner.badge || 'Creative Direction & Campaign Art'}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                      {banner.heading || 'Where Bold Strategy Meets Relentless Creative Craft.'}
                    </h4>

                    <p className="text-[11px] text-white/80 leading-relaxed line-clamp-2">
                      {banner.subheading || 'Branding, packaging dielines, and performance ad creative engineered for commercial resonance.'}
                    </p>

                    {/* Preview Image or Collage Thumbnail */}
                    {banner.imageUrl ? (
                      <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/20 mt-2">
                        <img
                          src={banner.imageUrl}
                          alt="Preview"
                          className={`w-full h-full object-cover ${focalPointClass}`}
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-full rounded-xl bg-gradient-to-r from-[#173B75] to-[#122B54] border border-white/15 flex items-center justify-center text-[10px] font-mono text-white/70">
                        [Studio Dynamic Collage Preview]
                      </div>
                    )}

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 bg-[#F07822] text-white px-4 py-1.5 rounded-full text-xs font-bold">
                        <span>{banner.ctaLabel || 'Discuss Your Brief'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 flex items-center justify-between">
              <span>* Preview updates in real-time as you type or change image settings.</span>
              <span className="font-mono">{banner.isDraft ? 'Status: Draft' : 'Status: Published'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
