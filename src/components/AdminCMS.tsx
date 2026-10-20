import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, ArrowUp, ArrowDown, Eye, Check, X,
  Upload, Image as ImageIcon, Sparkles, RefreshCw, Save,
  AlertCircle, CheckCircle2, Star, ExternalLink, Globe, Layers,
  Compass, ShieldCheck, ArrowRight, Copy, Palette, History,
  LayoutGrid, FolderPlus, Maximize2, Sliders, FileText, CheckCheck,
  RotateCcw, Video as VideoIcon
} from 'lucide-react';
import type {
  CMSPortfolioItem, CMSSiteContent, CMSTrustedBrand, CMSTestimonial,
  CMSProcessStep, CMSHeroSlide, CMSCustomSection, CMSSectionCard,
  CMSServiceConcept, MediaItem, CMSContentVersion
} from '../types';
import { ProjectDetailModal, PortfolioItem } from './ProjectDetailModal';
import { HeroBrandVideo } from './HeroBrandVideo';
import { Logo } from './Logo';
import { useSiteContent } from '../context/SiteContentContext';
import { DEFAULT_HERO_SLIDES } from './HeroShowcaseCarousel';
import { WebsiteImagesManager } from './WebsiteImagesManager';
import { ServicesBannerManager } from './ServicesBannerManager';

interface AdminCMSProps {
  token: string;
}

type CMSTab =
  | 'banners'
  | 'services-banner'
  | 'sections'
  | 'portfolio'
  | 'hero'
  | 'concepts'
  | 'site'
  | 'process'
  | 'brands'
  | 'testimonials'
  | 'media'
  | 'theme';

export const AdminCMS: React.FC<AdminCMSProps> = ({ token }) => {
  const { refreshContent } = useSiteContent();
  const [subTab, setSubTab] = useState<CMSTab>('sections');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // CMS state
  const [siteContent, setSiteContent] = useState<CMSSiteContent | null>(null);
  const [portfolioProjects, setPortfolioProjects] = useState<CMSPortfolioItem[]>([]);
  const [trustedBrands, setTrustedBrands] = useState<CMSTrustedBrand[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [customSections, setCustomSections] = useState<CMSCustomSection[]>([]);
  const [serviceConcepts, setServiceConcepts] = useState<CMSServiceConcept[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [contentVersions, setContentVersions] = useState<CMSContentVersion[]>([]);

  // Publishing & Version History Modals
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishLabel, setPublishLabel] = useState('');
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPageUrl, setPreviewPageUrl] = useState('/');

  // 1. Custom Sections State
  const [sectionPageFilter, setSectionPageFilter] = useState<string>('all');
  const [editingSection, setEditingSection] = useState<CMSCustomSection | null>(null);
  const [isNewSection, setIsNewSection] = useState(false);
  const [editingCard, setEditingCard] = useState<{ card: CMSSectionCard; index: number } | null>(null);
  const [isNewCard, setIsNewCard] = useState(false);
  const sectionBannerFileRef = useRef<HTMLInputElement>(null);
  const cardImageFileRef = useRef<HTMLInputElement>(null);

  // 2. Portfolio State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingProject, setEditingProject] = useState<CMSPortfolioItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [previewProject, setPreviewProject] = useState<PortfolioItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Service Concepts State
  const [conceptServiceFilter, setConceptServiceFilter] = useState<string>('all');
  const [editingConcept, setEditingConcept] = useState<CMSServiceConcept | null>(null);
  const [isNewConcept, setIsNewConcept] = useState(false);
  const conceptImageFileRef = useRef<HTMLInputElement>(null);

  // 4. Brands State
  const [editingBrand, setEditingBrand] = useState<CMSTrustedBrand | null>(null);
  const [isNewBrand, setIsNewBrand] = useState(false);
  const brandFileRef = useRef<HTMLInputElement>(null);

  // 5. Testimonial State
  const [editingTestimonial, setEditingTestimonial] = useState<CMSTestimonial | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);
  const clientPhotoRef = useRef<HTMLInputElement>(null);

  // 6. Media Library State
  const [mediaSearch, setMediaSearch] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const mediaUploadFileRef = useRef<HTMLInputElement>(null);
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);

  // 7. Theme & Logo & Hero Video
  const logoFileRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const videoPosterInputRef = useRef<HTMLInputElement>(null);
  const projectGalleryInputRef = useRef<HTMLInputElement>(null);
  const projectVideoInputRef = useRef<HTMLInputElement>(null);
  const projectVideoPosterInputRef = useRef<HTMLInputElement>(null);
  const [colorErrors, setColorErrors] = useState<Record<string, string>>({});
  const [activeProjectTab, setActiveProjectTab] = useState<'basics' | 'gallery' | 'video' | 'sections' | 'services'>('basics');

  const isValidHex = (hex: string): boolean => {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
  };

  const handleColorChange = (field: 'primaryColor' | 'backgroundColor' | 'brightBlueColor' | 'charcoalColor' | 'accentColor', value: string) => {
    if (!siteContent) return;
    let formatted = value.trim();
    if (!formatted.startsWith('#') && formatted.length > 0) {
      formatted = '#' + formatted;
    }
    setSiteContent({
      ...siteContent,
      [field]: formatted
    });

    if (formatted.length > 0 && !isValidHex(formatted)) {
      setColorErrors(prev => ({ ...prev, [field]: 'Invalid HEX code. Format must be #RRGGBB or #RGB.' }));
    } else {
      setColorErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleResetBrandColors = () => {
    if (!siteContent) return;
    setSiteContent({
      ...siteContent,
      primaryColor: '#173B75',
      backgroundColor: '#FFF9F1',
      brightBlueColor: '#2458A6',
      charcoalColor: '#252A34',
      accentColor: '#F07822'
    });
    setColorErrors({});
    showToast('Brand colors reset to official approved palette!');
  };

  // -------------------------------------------------------------
  // Data Fetching
  // -------------------------------------------------------------
  const loadCmsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSiteContent(data.siteContent);
        setPortfolioProjects(data.portfolioProjects || []);
        setTrustedBrands(data.trustedBrands || []);
        setTestimonials(data.testimonials || []);
        setCustomSections(data.customSections || []);
        setServiceConcepts(data.serviceConcepts || []);
        setMediaLibrary(data.mediaLibrary || []);
        setContentVersions(data.contentVersions || []);
      } else {
        setMessage({ text: 'Failed to load CMS content from server', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Error loading CMS', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCmsData();
  }, [token]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Base64 Image Upload Helper
  const uploadImageFile = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
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
          if (res.ok && data.url) {
            if (data.media) {
              setMediaLibrary(prev => [data.media, ...prev]);
            }
            resolve(data.url);
          } else {
            reject(new Error(data.error || 'Failed to upload image'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // -------------------------------------------------------------
  // DRAFTS, PUBLISHING & VERSION CONTROL
  // -------------------------------------------------------------
  const handleSaveDraft = async () => {
    if (!siteContent) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: siteContent })
      });
      if (res.ok) {
        const data = await res.json();
        setSiteContent(data.siteContent);
        showToast('Draft changes saved successfully to persistent database!');
      } else {
        showToast('Failed to save draft', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Draft save error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishLive = async () => {
    if (!siteContent) return;
    setPublishing(true);
    try {
      const res = await fetch('/api/admin/content/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: siteContent,
          label: publishLabel.trim() || undefined
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSiteContent(data.siteContent);
        setShowPublishModal(false);
        setPublishLabel('');
        showToast('Website changes published live successfully!');
        await refreshContent();
        loadCmsData();
      } else {
        showToast('Failed to publish changes', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Publish error', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this version? All website copy, headings and configuration will revert to this snapshot.')) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/versions/${versionId}/restore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSiteContent(data.siteContent);
        setShowVersionsModal(false);
        showToast('Previous version restored and published live!');
        await refreshContent();
      } else {
        showToast('Failed to restore version', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error restoring version', 'error');
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // 1. CUSTOM SECTIONS HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddSection = () => {
    setEditingSection({
      id: '',
      page: sectionPageFilter !== 'all' ? (sectionPageFilter as any) : 'home',
      title: '',
      subtitle: '',
      badge: '',
      description: '',
      layout: 'cards',
      order: customSections.length + 1,
      published: true,
      cards: [],
      bannerImage: '',
      ctaText: '',
      ctaLink: ''
    });
    setIsNewSection(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !editingSection.title) {
      showToast('Section title is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const method = isNewSection ? 'POST' : 'PUT';
      const endpoint = isNewSection ? '/api/admin/sections' : `/api/admin/sections/${editingSection.id}`;
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingSection)
      });
      if (res.ok) {
        const data = await res.json();
        if (isNewSection) {
          setCustomSections([...customSections, data.section]);
          showToast(`Section "${data.section.title}" created successfully!`);
        } else {
          setCustomSections(customSections.map(s => s.id === data.section.id ? data.section : s));
          showToast(`Section "${data.section.title}" updated successfully!`);
        }
        setEditingSection(null);
        await refreshContent();
      } else {
        showToast('Failed to save section', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving section', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateSection = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sections/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomSections([...customSections, data.section]);
        showToast('Section duplicated!');
        await refreshContent();
      }
    } catch (err: any) {
      showToast('Failed to duplicate section', 'error');
    }
  };

  const handleDeleteSection = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete section "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/sections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCustomSections(customSections.filter(s => s.id !== id));
        showToast(`Section "${title}" removed.`);
        await refreshContent();
      }
    } catch (err: any) {
      showToast('Failed to delete section', 'error');
    }
  };

  const handleReorderSections = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= customSections.length) return;
    const reordered = [...customSections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setCustomSections(reordered);

    try {
      await fetch('/api/admin/sections/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderedIds: reordered.map(s => s.id) })
      });
      await refreshContent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSectionPublish = async (section: CMSCustomSection) => {
    try {
      const updated = { ...section, published: !section.published };
      const res = await fetch(`/api/admin/sections/${section.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setCustomSections(customSections.map(s => s.id === section.id ? updated : s));
        showToast(`Section "${section.title}" is now ${updated.published ? 'Published' : 'Hidden'}.`);
        await refreshContent();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Section Cards Management
  const handleOpenAddCard = () => {
    setEditingCard({
      card: {
        id: `card-${Date.now()}`,
        title: '',
        subtitle: '',
        description: '',
        image: '',
        badge: '',
        link: '',
        ctaText: ''
      },
      index: -1
    });
    setIsNewCard(true);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !editingCard || !editingCard.card.title) {
      showToast('Card title is required', 'error');
      return;
    }
    const currentCards = [...(editingSection.cards || [])];
    if (isNewCard || editingCard.index === -1) {
      currentCards.push(editingCard.card);
    } else {
      currentCards[editingCard.index] = editingCard.card;
    }
    setEditingSection({
      ...editingSection,
      cards: currentCards
    });
    setEditingCard(null);
  };

  const handleDeleteCard = (index: number) => {
    if (!editingSection) return;
    const currentCards = [...(editingSection.cards || [])];
    currentCards.splice(index, 1);
    setEditingSection({
      ...editingSection,
      cards: currentCards
    });
  };

  // -------------------------------------------------------------
  // 2. PORTFOLIO HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProject({
      id: '',
      title: '',
      category: selectedCategory === 'All' ? 'Branding' : selectedCategory,
      tagline: '',
      image: '',
      isConcept: false,
      brief: '',
      approach: '',
      deliverables: [],
      specs: { format: 'Vector AI + 3D Render', timeline: '2-4 Weeks', tools: 'Figma, Illustrator' },
      tags: [],
      published: true,
      order: portfolioProjects.length + 1
    });
    setIsNewProject(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.image) {
      showToast('Please provide project title, category and high-resolution image', 'error');
      return;
    }
    setSaving(true);
    try {
      const method = isNewProject ? 'POST' : 'PUT';
      const endpoint = isNewProject ? '/api/admin/content/portfolio' : `/api/admin/content/portfolio/${editingProject.id}`;
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingProject)
      });
      if (res.ok) {
        const data = await res.json();
        if (isNewProject) {
          setPortfolioProjects([...portfolioProjects, data.project]);
          showToast(`Case study "${data.project.title}" published to portfolio!`);
        } else {
          setPortfolioProjects(portfolioProjects.map(p => p.id === data.project.id ? data.project : p));
          showToast(`Case study "${data.project.title}" updated successfully!`);
        }
        setEditingProject(null);
        await refreshContent();
      } else {
        showToast('Failed to save portfolio project', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the portfolio?`)) return;
    try {
      const res = await fetch(`/api/admin/content/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPortfolioProjects(portfolioProjects.filter(p => p.id !== id));
        showToast(`Project "${title}" deleted.`);
        await refreshContent();
      }
    } catch (err) {
      showToast('Failed to delete project', 'error');
    }
  };

  const handleReorderPortfolio = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= portfolioProjects.length) return;
    const reordered = [...portfolioProjects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setPortfolioProjects(reordered);

    try {
      await fetch('/api/admin/content/portfolio/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderedIds: reordered.map(p => p.id) })
      });
      await refreshContent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryInput.trim() || !siteContent) return;
    try {
      const res = await fetch('/api/admin/content/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ category: newCategoryInput.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setSiteContent({ ...siteContent, portfolioCategories: data.categories });
        setNewCategoryInput('');
        setShowAddCategory(false);
        showToast(`Category "${newCategoryInput.trim()}" added!`);
      }
    } catch (err) {
      showToast('Failed to add category', 'error');
    }
  };

  // -------------------------------------------------------------
  // 3. SERVICE CONCEPTS HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddConcept = () => {
    setEditingConcept({
      id: '',
      serviceId: conceptServiceFilter !== 'all' ? conceptServiceFilter : 'branding',
      title: '',
      category: 'Branding & Packaging',
      tagline: '',
      description: '',
      image: '',
      deliverables: ['Visual Identity', 'Dieline Packaging'],
      clientName: '',
      order: serviceConcepts.length + 1,
      published: true,
      featured: false
    });
    setIsNewConcept(true);
  };

  const handleSaveConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConcept || !editingConcept.title || !editingConcept.image) {
      showToast('Concept title and visual image are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const method = isNewConcept ? 'POST' : 'PUT';
      const endpoint = isNewConcept ? '/api/admin/concepts' : `/api/admin/concepts/${editingConcept.id}`;
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingConcept)
      });
      if (res.ok) {
        const data = await res.json();
        if (isNewConcept) {
          setServiceConcepts([...serviceConcepts, data.concept]);
          showToast(`Service concept "${data.concept.title}" created!`);
        } else {
          setServiceConcepts(serviceConcepts.map(c => c.id === data.concept.id ? data.concept : c));
          showToast(`Service concept "${data.concept.title}" updated!`);
        }
        setEditingConcept(null);
        await refreshContent();
      } else {
        showToast('Failed to save service concept', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving concept', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateConcept = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/concepts/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setServiceConcepts([...serviceConcepts, data.concept]);
        showToast('Concept duplicated!');
        await refreshContent();
      }
    } catch (err) {
      showToast('Failed to duplicate concept', 'error');
    }
  };

  const handleDeleteConcept = async (id: string, title: string) => {
    if (!confirm(`Delete concept "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/concepts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setServiceConcepts(serviceConcepts.filter(c => c.id !== id));
        showToast(`Concept "${title}" deleted.`);
        await refreshContent();
      }
    } catch (err) {
      showToast('Failed to delete concept', 'error');
    }
  };

  // -------------------------------------------------------------
  // 4. SITE COPY & HEADINGS HANDLERS
  // -------------------------------------------------------------
  const handleSaveSiteContent = async () => {
    if (!siteContent) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/site', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(siteContent)
      });
      if (res.ok) {
        showToast('Website copy and configuration saved successfully!');
        await refreshContent();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to save site content', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving site content', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProcessStep = (index: number, field: keyof CMSProcessStep, value: string) => {
    if (!siteContent) return;
    const currentSteps: CMSProcessStep[] = (siteContent.processSteps && siteContent.processSteps.length > 0)
      ? [...siteContent.processSteps]
      : [
          { id: 'step-1', number: '01', title: 'Brief', subtitle: 'Strategic Discovery', desc: 'Understanding the problem and brand vision.', iconName: 'Compass', badge: 'Step 1' },
          { id: 'step-2', number: '02', title: 'Create', subtitle: 'Design Sprints', desc: 'Translating strategy into packaging and brand identity.', iconName: 'Sparkles', badge: 'Step 2' },
          { id: 'step-3', number: '03', title: 'Review & Approve', subtitle: 'Collaborative Iteration', desc: 'Founder review rounds and print calibration.', iconName: 'CheckCircle', badge: 'Step 3' },
          { id: 'step-4', number: '04', title: 'Deliver & Pay', subtitle: 'Master Assets & Direct UPI', desc: 'Production-ready vector master files handed over.', iconName: 'ShieldCheck', badge: 'Step 4' }
        ];

    currentSteps[index] = { ...currentSteps[index], [field]: value };
    setSiteContent({ ...siteContent, processSteps: currentSteps });
  };

  const handleUpdateHeroSlide = (index: number, field: keyof CMSHeroSlide, value: string) => {
    if (!siteContent) return;
    const currentSlides: CMSHeroSlide[] = (siteContent.heroSlides && siteContent.heroSlides.length > 0)
      ? [...siteContent.heroSlides]
      : [...DEFAULT_HERO_SLIDES];

    currentSlides[index] = { ...currentSlides[index], [field]: value };
    setSiteContent({ ...siteContent, heroSlides: currentSlides });
  };

  const handleHeroSlideImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast(`Uploading image for slide ${index + 1}...`);
      const url = await uploadImageFile(file);
      if (url) {
        handleUpdateHeroSlide(index, 'imageUrl', url);
        showToast(`Slide ${index + 1} image uploaded! Click Save to apply.`);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upload image', 'error');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadImageFile(file);
      if (url && siteContent) {
        setSiteContent({ ...siteContent, logoUrl: url });
        showToast('Logo image uploaded! Click Save to apply.');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upload logo', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  // -------------------------------------------------------------
  // 5. BRANDS & TESTIMONIALS HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddBrand = () => {
    setEditingBrand({
      id: `tb-${Date.now()}`,
      name: '',
      logoUrl: '',
      order: trustedBrands.length + 1,
      active: true
    });
    setIsNewBrand(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editingBrand.name) return;
    setSaving(true);
    try {
      let updatedList: CMSTrustedBrand[];
      if (isNewBrand) {
        updatedList = [...trustedBrands, editingBrand];
      } else {
        updatedList = trustedBrands.map(b => b.id === editingBrand.id ? editingBrand : b);
      }
      const res = await fetch('/api/admin/content/brands', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ brands: updatedList })
      });
      if (res.ok) {
        setTrustedBrands(updatedList);
        setEditingBrand(null);
        showToast('Trusted brands marquee updated!');
        await refreshContent();
      }
    } catch (err) {
      showToast('Failed to update brand', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"?`)) return;
    const updated = trustedBrands.filter(b => b.id !== id);
    try {
      const res = await fetch('/api/admin/content/brands', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ brands: updated })
      });
      if (res.ok) {
        setTrustedBrands(updated);
        showToast(`Brand "${name}" removed.`);
        await refreshContent();
      }
    } catch (err) {
      showToast('Failed to delete brand', 'error');
    }
  };

  const handleOpenAddTestimonial = () => {
    setEditingTestimonial({
      id: '',
      clientName: '',
      company: '',
      designation: '',
      photoUrl: '',
      rating: 5,
      text: '',
      category: 'Branding & Packaging',
      published: true,
      order: testimonials.length + 1,
      isPlaceholder: false
    });
    setIsNewTestimonial(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.clientName || !editingTestimonial.text) {
      showToast('Client name and review quote are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const method = isNewTestimonial ? 'POST' : 'PUT';
      const endpoint = isNewTestimonial ? '/api/admin/content/testimonials' : `/api/admin/content/testimonials/${editingTestimonial.id}`;
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingTestimonial)
      });
      if (res.ok) {
        const data = await res.json();
        if (isNewTestimonial) {
          setTestimonials([...testimonials, data.testimonial]);
          showToast('Client review published!');
        } else {
          setTestimonials(testimonials.map(t => t.id === data.testimonial.id ? data.testimonial : t));
          showToast('Client review updated!');
        }
        setEditingTestimonial(null);
        await refreshContent();
      }
    } catch (err) {
      showToast('Failed to save testimonial', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: string, name: string) => {
    if (!confirm(`Delete review from "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/content/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id));
        showToast(`Review from "${name}" deleted.`);
        await refreshContent();
      }
    } catch (err) {
      showToast('Failed to delete review', 'error');
    }
  };

  // -------------------------------------------------------------
  // 6. MEDIA LIBRARY HANDLERS
  // -------------------------------------------------------------
  const handleUploadToMediaLibrary = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      showToast(`Uploading creative asset "${file.name}"...`);
      const url = await uploadImageFile(file);
      if (url) {
        showToast('Asset uploaded and registered in Central Media Vault!');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upload asset', 'error');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleUpdateMediaItem = async (id: string, updates: Partial<MediaItem>) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setMediaLibrary(mediaLibrary.map(m => m.id === id ? data.media : m));
        showToast('Asset properties updated!');
      }
    } catch (err) {
      showToast('Failed to update asset properties', 'error');
    }
  };

  const handleDeleteMediaItem = async (id: string) => {
    if (!confirm('Are you sure you want to remove this asset from the library?')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMediaLibrary(mediaLibrary.filter(m => m.id !== id));
        showToast('Asset removed from library.');
      } else {
        showToast(data.error || 'Cannot delete asset: in active use', 'error');
      }
    } catch (err) {
      showToast('Failed to delete media asset', 'error');
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    const fullUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedMediaId(id);
    setTimeout(() => setCopiedMediaId(null), 2500);
    showToast('Asset URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-[#E6E8ED] text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#ED650B] animate-spin mx-auto" />
        <p className="text-sm font-bold text-[#123578]">Loading Website CMS & Media Vault...</p>
      </div>
    );
  }

  const isDraftMode = Boolean(siteContent?.isDraft);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* PERSISTENT WORKFLOW CONTROL BAR (Save Draft / Preview / Publish Live) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#123578] text-white p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ED650B]">
              Goodfolk Solution CMS
            </span>
            {isDraftMode ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-950 animate-pulse" />
                Draft Mode (Changes Pending)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-400/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Published Live {siteContent?.lastPublishedAt ? `· ${new Date(siteContent.lastPublishedAt).toLocaleDateString('en-IN')}` : ''}
              </span>
            )}
          </div>
          <h2 className="text-xl font-black tracking-tight">Full Website & Content Management Suite</h2>
          <p className="text-xs text-white/75 max-w-xl">
            Control all public sections, case studies, visual assets, process steps, and brand settings without editing code. Changes persist across sessions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto justify-end">
          <button
            onClick={() => setShowVersionsModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Version history & 1-click restore"
          >
            <History className="w-3.5 h-3.5 text-[#ED650B]" />
            <span>History ({contentVersions.length})</span>
          </button>

          <button
            onClick={() => {
              window.open('/', '_blank');
            }}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Live Site</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            disabled={publishing}
            className="px-5 py-2.5 rounded-xl bg-[#ED650B] hover:bg-[#d65805] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Changes Live</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB NAVIGATION BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E4D8C8] pb-4">
        {[
          { id: 'banners', label: 'Website Images & Banners Manager', icon: ImageIcon },
          { id: 'services-banner', label: 'Services Creative Banner', icon: Sparkles },
          { id: 'sections', label: `Custom Sections (${customSections.length})`, icon: LayoutGrid },
          { id: 'portfolio', label: `Portfolio Projects (${portfolioProjects.length})`, icon: Layers },
          { id: 'hero', label: `Hero Showcase Slides (${((siteContent?.heroSlides && siteContent.heroSlides.length > 0) ? siteContent.heroSlides : DEFAULT_HERO_SLIDES).length})`, icon: ImageIcon },
          { id: 'concepts', label: `Service Concepts (${serviceConcepts.length})`, icon: FolderPlus },
          { id: 'site', label: 'Website Headings & Copy', icon: Globe },
          { id: 'process', label: 'Process Steps & Methodology', icon: Compass },
          { id: 'brands', label: `Trusted By Marquee (${trustedBrands.length})`, icon: Sparkles },
          { id: 'testimonials', label: `Client Reviews (${testimonials.length})`, icon: Star },
          { id: 'media', label: `Media Library (${mediaLibrary.length})`, icon: Maximize2 },
          { id: 'theme', label: 'Brand & Visual Settings', icon: Palette }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as CMSTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#173B75] text-white shadow-md'
                  : 'bg-white text-[#173B75] border border-[#E4D8C8] hover:bg-[#E8EFF8]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F07822]' : 'text-[#173B75]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DEDICATED TAB: WEBSITE IMAGES & BANNERS MANAGER */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'banners' && (
        <div className="animate-in fade-in duration-200">
          <WebsiteImagesManager token={token} onRefresh={loadCmsData} />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DEDICATED TAB: SERVICES PAGE CREATIVE BANNER */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'services-banner' && siteContent && (
        <div className="animate-in fade-in duration-200">
          <ServicesBannerManager
            token={token}
            siteContent={siteContent}
            mediaLibrary={mediaLibrary}
            onUpdateSiteContent={(updated) => setSiteContent(updated)}
            onRefresh={loadCmsData}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: CUSTOM SECTIONS BUILDER */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'sections' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Custom Website Sections Builder</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Add, reorder, duplicate and edit dynamic sections and interactive cards across any public page.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <select
                value={sectionPageFilter}
                onChange={e => setSectionPageFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED] bg-[#F7F7F5] text-[#123578]"
              >
                <option value="all">All Pages</option>
                <option value="home">Homepage Only</option>
                <option value="about">About Page Only</option>
                <option value="services">Services Page Only</option>
                <option value="contact">Contact Page Only</option>
                <option value="global">Global (All Pages)</option>
              </select>

              <button
                onClick={handleOpenAddSection}
                className="bg-[#ED650B] hover:bg-[#d65805] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Section</span>
              </button>
            </div>
          </div>

          {/* Sections List */}
          {customSections.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[#E6E8ED] text-center space-y-3">
              <LayoutGrid className="w-10 h-10 text-[#123578]/40 mx-auto" />
              <h3 className="text-base font-bold text-[#123578]">No Custom Sections Created Yet</h3>
              <p className="text-xs text-[#242832]/70 max-w-md mx-auto">
                Create your first custom section to display bespoke promotional banners, card groups, or feature breakdowns on the Homepage or About page.
              </p>
              <button
                onClick={handleOpenAddSection}
                className="mt-2 bg-[#123578] text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#ED650B]" />
                <span>Create Section Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {customSections
                .filter(s => sectionPageFilter === 'all' || s.page === sectionPageFilter || s.page === 'global')
                .map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="bg-white rounded-3xl p-6 border border-[#E6E8ED] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorderSections(idx, 'up')}
                          className="p-1 rounded-md border border-[#E6E8ED] hover:bg-[#EEF2F9] disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-[#123578]" />
                        </button>
                        <button
                          disabled={idx === customSections.length - 1}
                          onClick={() => handleReorderSections(idx, 'down')}
                          className="p-1 rounded-md border border-[#E6E8ED] hover:bg-[#EEF2F9] disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-[#123578]" />
                        </button>
                      </div>

                      {/* Details */}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#123578] text-white">
                            Page: {sec.page}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EEF2F9] text-[#123578]">
                            Layout: {sec.layout}
                          </span>
                          <span className="text-[10px] font-semibold text-[#242832]/60">
                            Cards: {sec.cards?.length || 0}
                          </span>
                          {sec.published ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              Published
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-[#123578]">{sec.title}</h3>
                        {sec.description && (
                          <p className="text-xs text-[#242832]/70 line-clamp-1">{sec.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                      <button
                        onClick={() => handleToggleSectionPublish(sec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          sec.published
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {sec.published ? 'Hide' : 'Publish'}
                      </button>

                      <button
                        onClick={() => handleDuplicateSection(sec.id)}
                        className="px-3 py-1.5 rounded-xl border border-[#E6E8ED] text-xs font-bold text-[#123578] hover:bg-[#EEF2F9] cursor-pointer"
                        title="Duplicate Section"
                      >
                        Duplicate
                      </button>

                      <button
                        onClick={() => {
                          setEditingSection({ ...sec });
                          setIsNewSection(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#123578] text-white text-xs font-bold hover:bg-[#0d285b] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#ED650B]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSection(sec.id, sec.title)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: PORTFOLIO SHOWCASE MANAGER */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'portfolio' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Portfolio Showcase Manager</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Add, edit, reorder, preview and publish case studies to the public portfolio & homepage.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setShowAddCategory(true)}
                className="px-3 py-2 rounded-xl border border-[#E6E8ED] bg-[#F7F7F5] text-[#123578] text-xs font-bold hover:bg-[#EEF2F9] cursor-pointer"
              >
                + New Category
              </button>

              <button
                onClick={handleOpenAddProject}
                className="bg-[#ED650B] hover:bg-[#d65805] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Case Study</span>
              </button>
            </div>
          </div>

          {/* Add Category Input */}
          {showAddCategory && (
            <div className="bg-white p-4 rounded-2xl border border-[#ED650B]/30 flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter new category (e.g., FMCG Packaging, 3D Commercials)"
                value={newCategoryInput}
                onChange={e => setNewCategoryInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 rounded-xl bg-[#123578] text-white text-xs font-bold cursor-pointer"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddCategory(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {(siteContent?.portfolioCategories || ['All', 'Branding', 'Packaging', 'Creative Design', 'Performance Marketing', 'Video & Social']).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#123578] text-white'
                    : 'bg-white text-[#242832]/70 border border-[#E6E8ED] hover:bg-[#EEF2F9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Portfolio Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioProjects
              .filter(p => selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase()))
              .map((project, idx) => (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl border border-[#E6E8ED] overflow-hidden shadow-xs flex flex-col justify-between group hover:shadow-md transition-all"
                >
                  <div className="relative h-48 bg-[#EEF2F9] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-[#123578]">
                      {project.category}
                    </div>
                    {project.isConcept && (
                      <div className="absolute top-3 right-3 bg-[#123578] text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                        Spec Concept
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#123578]">{project.title}</h3>
                      <p className="text-xs text-[#242832]/70 mt-1 line-clamp-2">{project.tagline}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E6E8ED] flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorderPortfolio(idx, 'up')}
                          className="p-1 rounded-md border border-[#E6E8ED] hover:bg-[#EEF2F9] disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-[#123578]" />
                        </button>
                        <button
                          disabled={idx === portfolioProjects.length - 1}
                          onClick={() => handleReorderPortfolio(idx, 'down')}
                          className="p-1 rounded-md border border-[#E6E8ED] hover:bg-[#EEF2F9] disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-[#123578]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewProject(project as any)}
                          className="p-1.5 rounded-lg border border-[#E6E8ED] hover:bg-[#EEF2F9] text-[#123578]"
                          title="Preview Modal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProject({ ...project });
                            setIsNewProject(false);
                          }}
                          className="p-1.5 rounded-lg bg-[#123578] text-white hover:bg-[#0d285b]"
                          title="Edit Case Study"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#ED650B]" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id, project.title)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                          title="Delete Case Study"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: HERO SHOWCASE SLIDES MANAGER */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'hero' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Homepage Hero Showcase Slides CMS</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Manage the 5 interactive showcase slides next to "We Build Brands That Move Businesses Forward."
              </p>
            </div>

            <button
              onClick={handleSaveSiteContent}
              disabled={saving}
              className="bg-[#ED650B] hover:bg-[#d65805] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save All Hero Slides'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {((siteContent?.heroSlides && siteContent.heroSlides.length > 0)
              ? siteContent.heroSlides
              : DEFAULT_HERO_SLIDES
            ).map((slide, sIdx) => (
              <div
                key={slide.id || sIdx}
                className="bg-white rounded-3xl p-5 border border-[#E6E8ED] shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-[#EEF2F9] border border-[#E6E8ED]">
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white">
                      Slide {sIdx + 1}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">
                      Category Label
                    </label>
                    <input
                      type="text"
                      value={slide.category}
                      onChange={e => handleUpdateHeroSlide(sIdx, 'category', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6E8ED] font-semibold text-[#123578]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={e => handleUpdateHeroSlide(sIdx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6E8ED] font-bold text-[#123578]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">
                      Target Destination Link
                    </label>
                    <input
                      type="text"
                      value={slide.targetPath}
                      onChange={e => handleUpdateHeroSlide(sIdx, 'targetPath', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6E8ED] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">
                    Replace Slide Image
                  </label>
                  <label className="w-full py-2 px-3 rounded-xl bg-[#EEF2F9] text-[#123578] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#123578] hover:text-white transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#ED650B]" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleHeroSlideImageUpload(sIdx, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: SERVICE CONCEPTS & CURATED CASE STUDIES */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'concepts' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Service Concepts & Curated Case Studies</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Manage discipline-specific work shown on the Services page for Branding, Creative, Performance, Video, and Digital.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <select
                value={conceptServiceFilter}
                onChange={e => setConceptServiceFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED] bg-[#F7F7F5] text-[#123578]"
              >
                <option value="all">All Services</option>
                <option value="branding">Branding & Packaging</option>
                <option value="creative">Creative Design & E-com</option>
                <option value="performance">Performance Marketing</option>
                <option value="video">Video Production</option>
                <option value="digital">Digital Marketing</option>
              </select>

              <button
                onClick={handleOpenAddConcept}
                className="bg-[#ED650B] hover:bg-[#d65805] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Concept</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceConcepts
              .filter(c => conceptServiceFilter === 'all' || c.serviceId === conceptServiceFilter)
              .map((concept, idx) => (
                <div
                  key={concept.id}
                  className="bg-white rounded-3xl border border-[#E6E8ED] overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-[#EEF2F9] overflow-hidden">
                    <img src={concept.image} alt={concept.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-[#123578]">
                      {concept.serviceId}
                    </div>
                  </div>

                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#123578]">{concept.title}</h4>
                      <p className="text-xs text-[#242832]/70 line-clamp-2">{concept.tagline || concept.description}</p>
                      {concept.deliverables && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {concept.deliverables.slice(0, 3).map((d, i) => (
                            <span key={i} className="text-[9px] bg-[#EEF2F9] text-[#123578] px-1.5 py-0.5 rounded">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#E6E8ED] flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#ED650B]">
                        {concept.clientName || 'Studio Case'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDuplicateConcept(concept.id)}
                          className="p-1 rounded-lg border border-[#E6E8ED] hover:bg-[#EEF2F9] text-xs font-bold"
                          title="Duplicate"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => {
                            setEditingConcept({ ...concept });
                            setIsNewConcept(false);
                          }}
                          className="p-1.5 rounded-lg bg-[#123578] text-white"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#ED650B]" />
                        </button>
                        <button
                          onClick={() => handleDeleteConcept(concept.id, concept.title)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: WEBSITE HEADINGS & COPY */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'site' && siteContent && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Website Headings, Copy & Brand Info</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Customize public headlines, narrative statements, and contact channels across the site.
              </p>
            </div>

            <button
              onClick={handleSaveSiteContent}
              disabled={saving}
              className="bg-[#ED650B] hover:bg-[#d65805] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Website Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Brand Logo & Identity */}
            <div className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#123578] uppercase tracking-wider">Logo & Brand Identity</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Logo Text</label>
                  <input
                    type="text"
                    value={siteContent.logoText}
                    onChange={e => setSiteContent({ ...siteContent, logoText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Logo Subtitle</label>
                  <input
                    type="text"
                    value={siteContent.logoSubtitle}
                    onChange={e => setSiteContent({ ...siteContent, logoSubtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-serif italic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Upload Brand Graphic Logo</label>
                <input
                  type="file"
                  ref={logoFileRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  disabled={uploadingLogo}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EEF2F9] text-xs font-bold text-[#123578] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#EEF2F9]/80"
                >
                  <Upload className="w-4 h-4 text-[#ED650B]" />
                  <span>{uploadingLogo ? 'Uploading logo...' : 'Upload Logo Image (PNG / SVG)'}</span>
                </button>
                {siteContent.logoUrl && (
                  <div className="mt-2 p-2 bg-[#F7F7F5] rounded-xl flex items-center justify-between border border-[#E6E8ED]">
                    <img src={siteContent.logoUrl} alt="Logo" className="h-6 object-contain" />
                    <button
                      onClick={() => setSiteContent({ ...siteContent, logoUrl: '' })}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Hero Headline */}
            <div className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#123578] uppercase tracking-wider">Homepage Hero Section</h3>
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={siteContent.heroHeadline}
                  onChange={e => setSiteContent({ ...siteContent, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-bold text-[#123578]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Hero Subheadline</label>
                <textarea
                  rows={3}
                  value={siteContent.heroSubheadline}
                  onChange={e => setSiteContent({ ...siteContent, heroSubheadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>
            </div>

            {/* 3. About Us Narrative */}
            <div className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-[#123578] uppercase tracking-wider">About Us Page Narrative</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">About Headline</label>
                  <input
                    type="text"
                    value={siteContent.aboutHeadline}
                    onChange={e => setSiteContent({ ...siteContent, aboutHeadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-bold text-[#123578]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">About Tagline</label>
                  <input
                    type="text"
                    value={siteContent.aboutTagline}
                    onChange={e => setSiteContent({ ...siteContent, aboutTagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Our Story</label>
                  <textarea
                    rows={4}
                    value={siteContent.aboutStory}
                    onChange={e => setSiteContent({ ...siteContent, aboutStory: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Our Approach</label>
                  <textarea
                    rows={4}
                    value={siteContent.aboutApproach}
                    onChange={e => setSiteContent({ ...siteContent, aboutApproach: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>
            </div>

            {/* 4. Contact Details & Official Channels */}
            <div className="bg-white p-6 rounded-3xl border border-[#E4D8C8] shadow-xs space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#173B75] uppercase tracking-wider">Contact Details & Communication Channels</h3>
                <span className="text-[10px] bg-[#E8EFF8] text-[#173B75] px-2.5 py-0.5 rounded-full font-bold">
                  Verified Channels
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">Official Email</label>
                  <input
                    type="email"
                    value={siteContent.contactEmail}
                    onChange={e => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4D8C8] focus:ring-2 focus:ring-[#173B75]"
                  />
                  <span className="text-[10px] text-[#252A34]/60 mt-0.5 block">Shown on contact page & footer</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                    Displayed Mobile Number *
                  </label>
                  <input
                    type="text"
                    value={siteContent.contactPhone}
                    onChange={e => setSiteContent({ ...siteContent, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4D8C8] font-mono font-bold text-[#173B75] focus:ring-2 focus:ring-[#173B75]"
                    placeholder="0000000"
                  />
                  <span className="text-[10px] text-[#252A34]/60 mt-0.5 block">
                    Public displayed number (Set to: 0000000)
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                    Functional WhatsApp / Calling
                  </label>
                  <input
                    type="text"
                    value={siteContent.functionalPhoneDestination || siteContent.contactWhatsapp}
                    onChange={e => setSiteContent({ ...siteContent, functionalPhoneDestination: e.target.value, contactWhatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4D8C8] font-mono text-[#173B75] focus:ring-2 focus:ring-[#173B75]"
                    placeholder="+91 9817961412"
                  />
                  <span className="text-[10px] text-[#252A34]/60 mt-0.5 block">
                    Actual click target (wa.me / dialer)
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">Instagram Profile URL</label>
                  <input
                    type="text"
                    value={siteContent.contactInstagram}
                    onChange={e => setSiteContent({ ...siteContent, contactInstagram: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4D8C8] focus:ring-2 focus:ring-[#173B75]"
                  />
                  <span className="text-[10px] text-[#252A34]/60 mt-0.5 block">Studio Instagram link</span>
                </div>
              </div>

              {/* Final CTA Copy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Final CTA Headline</label>
                  <input
                    type="text"
                    value={siteContent.ctaHeadline}
                    onChange={e => setSiteContent({ ...siteContent, ctaHeadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-bold text-[#123578]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Final CTA Subheadline</label>
                  <input
                    type="text"
                    value={siteContent.ctaSubheadline}
                    onChange={e => setSiteContent({ ...siteContent, ctaSubheadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: PROCESS STEPS & METHODOLOGY */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'process' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Our Process & Methodology Manager</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Edit the 4 animated milestone stages displayed on the About Us page timeline.
              </p>
            </div>

            <button
              onClick={handleSaveSiteContent}
              disabled={saving}
              className="bg-[#ED650B] hover:bg-[#d65805] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Process Steps'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(siteContent?.processSteps || []).map((step, idx) => (
              <div key={step.id || idx} className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Stage Number</label>
                    <input
                      type="text"
                      value={step.number}
                      onChange={e => handleUpdateProcessStep(idx, 'number', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Stage Heading</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={e => handleUpdateProcessStep(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-bold text-[#123578]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={step.subtitle || ''}
                      onChange={e => handleUpdateProcessStep(idx, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Stage Badge</label>
                    <input
                      type="text"
                      value={step.badge || ''}
                      onChange={e => handleUpdateProcessStep(idx, 'badge', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={step.desc}
                    onChange={e => handleUpdateProcessStep(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 7: TRUSTED BY MARQUEE */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'brands' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Trusted By Marquee Manager</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Manage client brand cards and logos that animate in the continuous right-to-left marquee.
              </p>
            </div>

            <button
              onClick={handleOpenAddBrand}
              className="bg-[#123578] hover:bg-[#0d285b] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#ED650B]" />
              <span>Add Brand</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustedBrands.map(brand => (
              <div
                key={brand.id}
                className="bg-white p-5 rounded-2xl border border-[#E6E8ED] shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F7F5] border border-[#E6E8ED] flex items-center justify-center p-2 shrink-0">
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#123578]">{brand.name.slice(0, 3)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#123578]">{brand.name}</h4>
                    <span className={`text-[10px] font-semibold ${brand.active ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {brand.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingBrand({ ...brand });
                      setIsNewBrand(false);
                    }}
                    className="p-1.5 rounded-lg border border-[#E6E8ED] text-[#123578] hover:bg-[#EEF2F9]"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand.id, brand.name)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 8: CLIENT TESTIMONIALS */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'testimonials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Client Reviews & Testimonials CMS</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Manage client testimonials, star ratings, photos and case study reviews.
              </p>
            </div>

            <button
              onClick={handleOpenAddTestimonial}
              className="bg-[#123578] hover:bg-[#0d285b] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#ED650B]" />
              <span>Add Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(test => (
              <div
                key={test.id}
                className="bg-white rounded-3xl p-6 border border-[#E6E8ED] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#ED650B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < test.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      test.published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {test.published ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-[#242832]/85 italic leading-relaxed">"{test.text}"</p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E6E8ED] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#123578] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {test.photoUrl ? (
                        <img src={test.photoUrl} alt={test.clientName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{test.clientName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#123578]">{test.clientName}</h4>
                      <p className="text-[10px] text-[#242832]/70">{test.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTestimonial({ ...test });
                        setIsNewTestimonial(false);
                      }}
                      className="p-1.5 rounded-lg border border-[#E6E8ED] hover:bg-[#EEF2F9] text-[#123578]"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(test.id, test.clientName)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 9: CREATIVE ASSET VAULT / MEDIA LIBRARY */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'media' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Creative Asset Vault & Media Library</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Upload your professionally designed creatives, set image focal points, and use them anywhere across the site.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={mediaUploadFileRef}
                onChange={handleUploadToMediaLibrary}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => mediaUploadFileRef.current?.click()}
                disabled={uploadingMedia}
                className="bg-[#ED650B] hover:bg-[#d65805] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploadingMedia ? 'Uploading...' : 'Upload New Creative Asset'}</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6E8ED]">
            <input
              type="text"
              placeholder="Search assets by file name or alt text..."
              value={mediaSearch}
              onChange={e => setMediaSearch(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
            />
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaLibrary
              .filter(m => !mediaSearch || m.name.toLowerCase().includes(mediaSearch.toLowerCase()) || m.altText?.toLowerCase().includes(mediaSearch.toLowerCase()))
              .map(asset => (
                <div
                  key={asset.id}
                  className="bg-white rounded-2xl border border-[#E6E8ED] overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative h-36 bg-[#EEF2F9] overflow-hidden">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      style={{ objectFit: asset.fit || 'cover', objectPosition: asset.focalPoint || 'center' }}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#123578] truncate max-w-[130px]">{asset.name}</span>
                      <span className="text-[9px] text-[#242832]/60 font-mono">
                        {asset.size ? `${Math.round(asset.size / 1024)} KB` : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-[#123578]">Focal Point</label>
                        <select
                          value={asset.focalPoint || 'center'}
                          onChange={e => handleUpdateMediaItem(asset.id, { focalPoint: e.target.value as any })}
                          className="w-full px-1.5 py-1 text-[10px] rounded-lg border border-[#E6E8ED] bg-[#F7F7F5]"
                        >
                          <option value="center">Center</option>
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold uppercase text-[#123578]">Fit Mode</label>
                        <select
                          value={asset.fit || 'cover'}
                          onChange={e => handleUpdateMediaItem(asset.id, { fit: e.target.value as any })}
                          className="w-full px-1.5 py-1 text-[10px] rounded-lg border border-[#E6E8ED] bg-[#F7F7F5]"
                        >
                          <option value="cover">Cover (Fill)</option>
                          <option value="contain">Contain (Fit)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E6E8ED] flex items-center justify-between">
                      <button
                        onClick={() => handleCopyUrl(asset.id, asset.url)}
                        className="text-[10px] font-bold text-[#123578] hover:text-[#ED650B] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedMediaId === asset.id ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedMediaId === asset.id ? 'Copied!' : 'Copy URL'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMediaItem(asset.id)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 10: BRAND & VISUAL SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'theme' && siteContent && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#123578]">Brand Colors & Visual Settings</h2>
              <p className="text-xs text-[#242832]/70 mt-0.5">
                Inspect and maintain the official brand color tokens and animation styling across the website.
              </p>
            </div>

            <button
              onClick={handleSaveSiteContent}
              disabled={saving}
              className="bg-[#ED650B] hover:bg-[#d65805] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. GENUINELY EDITABLE BRAND COLORS (Clickable Picker + Manual HEX + Validation) */}
            <div className="bg-white p-6 rounded-3xl border border-[#E4D8C8] shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#173B75] uppercase tracking-wider">
                    Editable Brand Colors & Palette
                  </h3>
                  <p className="text-xs text-[#252A34]/70 mt-0.5">
                    Click color pickers or enter custom HEX codes. Updates apply directly to the public website upon saving.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetBrandColors}
                  className="px-3 py-1.5 rounded-xl border border-[#E4D8C8] bg-[#FFF9F1] hover:bg-[#E8EFF8] text-[#173B75] text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                >
                  Reset Defaults
                </button>
              </div>

              {/* Dynamic Live Proportion Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#173B75]">
                  <span>Live Palette Proportions</span>
                  <span className="font-mono text-[10px] text-[#252A34]/60">100% Balanced</span>
                </div>
                <div className="h-4 rounded-xl overflow-hidden flex shadow-xs border border-black/10">
                  <div style={{ width: '40%', backgroundColor: siteContent.primaryColor || '#173B75' }} title="Navy 40%" />
                  <div style={{ width: '35%', backgroundColor: siteContent.backgroundColor || '#FFF9F1' }} title="Soft Cream 35%" />
                  <div style={{ width: '15%', backgroundColor: siteContent.brightBlueColor || '#2458A6' }} title="Bright Blue 15%" />
                  <div style={{ width: '7%', backgroundColor: siteContent.charcoalColor || '#252A34' }} title="Charcoal 7%" />
                  <div style={{ width: '3%', backgroundColor: siteContent.accentColor || '#F07822' }} title="Warm Orange 3%" />
                </div>
                <div className="flex justify-between text-[10px] text-[#252A34]/65 pt-0.5 font-medium">
                  <span>Navy: 40%</span>
                  <span>Cream: 35%</span>
                  <span>Blue: 15%</span>
                  <span>Charcoal: 7%</span>
                  <span>Orange: 3% (CTAs)</span>
                </div>
              </div>

              {/* 5 Genuinely Editable Color Fields with Clickable Color Picker */}
              <div className="space-y-3 pt-1">
                {[
                  {
                    key: 'primaryColor' as const,
                    name: 'Navy (Primary)',
                    current: siteContent.primaryColor || '#173B75',
                    fallback: '#173B75',
                    proportion: '40%',
                    desc: 'Headings, primary brand lockup, key navigation'
                  },
                  {
                    key: 'backgroundColor' as const,
                    name: 'Soft Cream (Canvas)',
                    current: siteContent.backgroundColor || '#FFF9F1',
                    fallback: '#FFF9F1',
                    proportion: '35%',
                    desc: 'Warm canvas background, card panels, soft containers'
                  },
                  {
                    key: 'brightBlueColor' as const,
                    name: 'Bright Blue (Secondary)',
                    current: siteContent.brightBlueColor || '#2458A6',
                    fallback: '#2458A6',
                    proportion: '15%',
                    desc: 'Secondary highlights, emblem ribbon, active badges'
                  },
                  {
                    key: 'charcoalColor' as const,
                    name: 'Charcoal (Supporting)',
                    current: siteContent.charcoalColor || '#252A34',
                    fallback: '#252A34',
                    proportion: '7%',
                    desc: 'Body paragraphs, subtle typography, meta text'
                  },
                  {
                    key: 'accentColor' as const,
                    name: 'Warm Orange (Accent & CTAs)',
                    current: siteContent.accentColor || '#F07822',
                    fallback: '#F07822',
                    proportion: '3%',
                    desc: 'Primary CTA buttons, active states, spark dots'
                  }
                ].map(c => {
                  const error = colorErrors[c.key];
                  const hexValue = c.current;

                  return (
                    <div
                      key={c.key}
                      className="p-3 rounded-2xl border border-[#E4D8C8] bg-[#FFF9F1] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#173B75]">{c.name}</span>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E4D8C8] font-mono text-[#F07822]">
                            {c.proportion}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#252A34]/60">{c.desc}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Clickable Color Picker Button */}
                        <div className="relative shrink-0">
                          <input
                            type="color"
                            id={`picker-${c.key}`}
                            value={isValidHex(hexValue) ? hexValue : c.fallback}
                            onChange={e => handleColorChange(c.key, e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                            title="Click to open color picker"
                          />
                          <div
                            className="w-10 h-10 rounded-xl border-2 border-white shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                            style={{ backgroundColor: isValidHex(hexValue) ? hexValue : c.fallback }}
                          >
                            <Palette className="w-4 h-4 text-white drop-shadow-md opacity-80" />
                          </div>
                        </div>

                        {/* Manual HEX Text Input */}
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            maxLength={7}
                            value={c.current}
                            onChange={e => handleColorChange(c.key, e.target.value)}
                            placeholder={c.fallback}
                            className={`w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border bg-white focus:outline-none transition-all ${
                              error
                                ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                                : 'border-[#E4D8C8] focus:ring-2 focus:ring-[#173B75]/20'
                            }`}
                          />
                        </div>

                        {/* Live Color Swatch Preview */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            className="w-7 h-7 rounded-lg border border-black/15 shadow-2xs"
                            style={{ backgroundColor: isValidHex(hexValue) ? hexValue : c.fallback }}
                            title="Live Preview"
                          />
                          <button
                            type="button"
                            onClick={() => handleColorChange(c.key, c.fallback)}
                            className="text-[10px] text-[#173B75] hover:text-[#F07822] font-semibold underline cursor-pointer"
                          >
                            Default
                          </button>
                        </div>
                      </div>

                      {/* Validation Error Message */}
                      {error && (
                        <p className="text-[11px] text-red-600 font-semibold">{error}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. 15-SECOND HERO BRAND VIDEO & CTA ANIMATION SETTINGS */}
            <div className="space-y-6">
              {/* HERO BRAND VIDEO MANAGER */}
              <div className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#173B75] uppercase tracking-wider flex items-center gap-2">
                      <span>15-Second Hero Brand Video</span>
                      <span className="text-[10px] font-mono bg-[#F07822]/10 text-[#F07822] px-2 py-0.5 rounded-full font-bold">
                        Section 4
                      </span>
                    </h3>
                    <p className="text-xs text-[#252A34]/70 mt-0.5">
                      Manage the 15-second agency film displayed alongside "Good Ideas Deserve Good Folks."
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-[#F7F7F5] px-3 py-1.5 rounded-xl border border-[#E6E8ED]">
                    <input
                      type="checkbox"
                      checked={siteContent.heroVideoEnabled !== false}
                      onChange={e => setSiteContent({ ...siteContent, heroVideoEnabled: e.target.checked })}
                      className="w-4 h-4 text-[#F07822] rounded"
                    />
                    <span className="text-xs font-bold text-[#173B75]">Video Enabled</span>
                  </label>
                </div>

                {/* Video Headline Override */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                    Homepage Hero Headline
                  </label>
                  <input
                    type="text"
                    value={siteContent.heroHeadline || 'Good Ideas Deserve Good Folks.'}
                    onChange={e => setSiteContent({ ...siteContent, heroHeadline: e.target.value })}
                    placeholder="Good Ideas Deserve Good Folks."
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED] bg-white text-[#173B75]"
                  />
                  <p className="text-[10px] text-[#252A34]/60 mt-1">
                    Approved Brand Headline: "Good Ideas Deserve Good Folks."
                  </p>
                </div>

                {/* Video Source File / URL */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                    Video Media File (MP4, WebM) or Public URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={siteContent.heroVideoUrl || ''}
                      onChange={e => setSiteContent({ ...siteContent, heroVideoUrl: e.target.value })}
                      placeholder="Built-in 15s Agency Loop (or enter /uploads/... or https://...)"
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white"
                    />
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await uploadImageFile(file);
                            if (url) {
                              setSiteContent({ ...siteContent, heroVideoUrl: url });
                              showToast('15-Second video uploaded successfully!');
                            }
                          } catch (err: any) {
                            showToast(err.message || 'Failed to upload video', 'error');
                          }
                        }
                      }}
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-[#EEF2F9] text-xs font-bold text-[#173B75] hover:bg-[#173B75] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#F07822]" />
                      <span>Upload Video</span>
                    </button>
                    {siteContent.heroVideoUrl && (
                      <button
                        type="button"
                        onClick={() => setSiteContent({ ...siteContent, heroVideoUrl: '' })}
                        className="px-2.5 py-2 rounded-xl border border-[#E6E8ED] text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Reset to built-in 15s agency film"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-[#252A34]/60 mt-1">
                    {siteContent.heroVideoUrl
                      ? `Custom video active: ${siteContent.heroVideoUrl}`
                      : 'Built-in original 15s cinematic agency film active (manifesto, visual systems, 3D packaging & results).'}
                  </p>
                </div>

                {/* Poster Fallback Image */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                    Video Fallback Poster Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={siteContent.heroVideoPoster || ''}
                      onChange={e => setSiteContent({ ...siteContent, heroVideoPoster: e.target.value })}
                      placeholder="Paste poster image URL (or upload image)"
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white"
                    />
                    <input
                      type="file"
                      ref={videoPosterInputRef}
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImageFile(file);
                          if (url) {
                            setSiteContent({ ...siteContent, heroVideoPoster: url });
                            showToast('Video poster uploaded!');
                          }
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => videoPosterInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-[#EEF2F9] text-xs font-bold text-[#173B75] hover:bg-[#173B75] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#F07822]" />
                      <span>Upload Poster</span>
                    </button>
                  </div>
                </div>

                {/* Live Video Preview in Admin */}
                <div className="pt-2 border-t border-[#E6E8ED]">
                  <div className="text-xs font-bold text-[#173B75] mb-2 flex items-center justify-between">
                    <span>Live Video Preview (Homepage Player)</span>
                    <span className="font-mono text-[10px] text-[#F07822]">15-Second Loop</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-md max-w-sm mx-auto">
                    <HeroBrandVideo
                      videoUrl={siteContent.heroVideoUrl}
                      posterUrl={siteContent.heroVideoPoster}
                      headline={siteContent.heroHeadline || 'Good Ideas Deserve Good Folks.'}
                    />
                  </div>
                </div>
              </div>

              {/* CTA ANIMATION SETTINGS */}
              <div className="bg-white p-6 rounded-3xl border border-[#E6E8ED] shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#173B75] uppercase tracking-wider">
                  Distinctive CTA Banner Animation
                </h3>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                    Final "Let's Talk" CTA Background Animation
                  </label>
                  <select
                    value={siteContent.ctaAnimationType || 'particles'}
                    onChange={e => setSiteContent({ ...siteContent, ctaAnimationType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white font-bold text-[#173B75]"
                  >
                    <option value="particles">Kinetic Aurora Vector Ribbons & Constellation Nodes (Recommended)</option>
                    <option value="none">Static Clean Navy Background</option>
                  </select>
                  <p className="text-[11px] text-[#252A34]/70 mt-1.5 leading-relaxed">
                    A distinctive, high-end flowing kinetic ribbon wave animation in Navy `#173B75`, Bright Blue `#2458A6`, and Warm Orange `#F07822` with pulsing constellation nodes that stay in the deep background without obscuring readability or button interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: ADD / EDIT CUSTOM SECTION */}
      {/* ------------------------------------------------------------- */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl border border-[#E6E8ED] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E6E8ED] flex items-center justify-between bg-[#F7F7F5]">
              <div>
                <h3 className="text-base font-black text-[#123578]">
                  {isNewSection ? 'Create New Website Section' : `Edit Section: ${editingSection.title}`}
                </h3>
                <p className="text-xs text-[#242832]/70">
                  Configure page placement, layout style, cards, and CTA actions.
                </p>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Target Page *</label>
                  <select
                    value={editingSection.page}
                    onChange={e => setEditingSection({ ...editingSection, page: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white font-bold"
                  >
                    <option value="home">Homepage</option>
                    <option value="about">About Us Page</option>
                    <option value="services">Services Page</option>
                    <option value="contact">Contact Page</option>
                    <option value="global">Global (Every Page)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Layout Style *</label>
                  <select
                    value={editingSection.layout}
                    onChange={e => setEditingSection({ ...editingSection, layout: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white font-bold"
                  >
                    <option value="cards">Cards Grid (3 Columns with Hover Zoom)</option>
                    <option value="features">Features Breakdown (2 Columns with Icons)</option>
                    <option value="banner">Promotional Banner (Wide Hero Bar)</option>
                    <option value="grid">Compact Grid (4 Columns)</option>
                    <option value="text-split">Text & Creative Split (2 Columns)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Section Title *</label>
                  <input
                    type="text"
                    required
                    value={editingSection.title}
                    onChange={e => setEditingSection({ ...editingSection, title: e.target.value })}
                    placeholder="e.g., Why Leading Brands Trust Goodfolk"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-bold text-[#123578]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Top Badge Label</label>
                  <input
                    type="text"
                    value={editingSection.badge || ''}
                    onChange={e => setEditingSection({ ...editingSection, badge: e.target.value })}
                    placeholder="e.g., Our Guarantee / Agency Advantage"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Subtitle / Supporting Hook</label>
                <input
                  type="text"
                  value={editingSection.subtitle || ''}
                  onChange={e => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                  placeholder="e.g., Strategic clarity and meticulous craft under one roof"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Section Description</label>
                <textarea
                  rows={2}
                  value={editingSection.description || ''}
                  onChange={e => setEditingSection({ ...editingSection, description: e.target.value })}
                  placeholder="Brief explanatory overview paragraph..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              {/* Banner Image (for banner or text-split layout) */}
              {(editingSection.layout === 'banner' || editingSection.layout === 'text-split') && (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Banner / Visual Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingSection.bannerImage || ''}
                      onChange={e => setEditingSection({ ...editingSection, bannerImage: e.target.value })}
                      placeholder="Paste image URL (https://... or /uploads/...)"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                    />
                    <input
                      type="file"
                      ref={sectionBannerFileRef}
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImageFile(file);
                          if (url) setEditingSection({ ...editingSection, bannerImage: url });
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => sectionBannerFileRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-[#EEF2F9] text-[#123578] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  </div>
                  {editingSection.bannerImage && (
                    <div className="mt-2 h-24 rounded-xl overflow-hidden bg-[#EEF2F9] border border-[#E6E8ED]">
                      <img src={editingSection.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* Section-level CTA */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Section CTA Button Text</label>
                  <input
                    type="text"
                    value={editingSection.ctaText || ''}
                    onChange={e => setEditingSection({ ...editingSection, ctaText: e.target.value })}
                    placeholder="e.g., Get In Touch / View Portfolio"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Section CTA Link</label>
                  <input
                    type="text"
                    value={editingSection.ctaLink || ''}
                    onChange={e => setEditingSection({ ...editingSection, ctaLink: e.target.value })}
                    placeholder="e.g., /contact, /portfolio, or #services"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>

              {/* Section Cards Manager */}
              <div className="pt-4 border-t border-[#E6E8ED] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[#123578]">Section Cards ({editingSection.cards?.length || 0})</h4>
                    <p className="text-[11px] text-[#242832]/60">Cards rendered inside this section's layout.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddCard}
                    className="px-3 py-1.5 rounded-xl bg-[#123578] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#ED650B]" />
                    <span>Add Card</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(editingSection.cards || []).map((card, cIdx) => (
                    <div key={card.id || cIdx} className="p-3 rounded-xl border border-[#E6E8ED] bg-[#F7F7F5] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {card.image && (
                          <img src={card.image} alt={card.title} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-[#123578]">{card.title}</div>
                          <div className="text-[10px] text-[#242832]/70 line-clamp-1">{card.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCard({ card: { ...card }, index: cIdx });
                            setIsNewCard(false);
                          }}
                          className="p-1 rounded-md border border-[#E6E8ED] text-[#123578] hover:bg-white"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(cIdx)}
                          className="p-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="sectionPublish"
                  checked={editingSection.published}
                  onChange={e => setEditingSection({ ...editingSection, published: e.target.checked })}
                  className="w-4 h-4 text-[#ED650B] rounded"
                />
                <label htmlFor="sectionPublish" className="text-xs font-bold text-[#123578] cursor-pointer">
                  Publish this section on the live website immediately
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[#E6E8ED]">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#ED650B] text-white shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1B: ADD / EDIT CARD INSIDE SECTION */}
      {/* ------------------------------------------------------------- */}
      {editingCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#E6E8ED] animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#E6E8ED] flex items-center justify-between bg-[#F7F7F5]">
              <h3 className="text-sm font-black text-[#123578]">
                {isNewCard ? 'Add Card to Section' : 'Edit Section Card'}
              </h3>
              <button onClick={() => setEditingCard(null)} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="p-5 space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#123578] mb-1">Card Title *</label>
                <input
                  type="text"
                  required
                  value={editingCard.card.title}
                  onChange={e => setEditingCard({ ...editingCard, card: { ...editingCard.card, title: e.target.value } })}
                  placeholder="e.g., Conversion-Focused Layout"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#123578] mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingCard.card.badge || ''}
                    onChange={e => setEditingCard({ ...editingCard, card: { ...editingCard.card, badge: e.target.value } })}
                    placeholder="e.g., 01 or Feature"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#123578] mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editingCard.card.subtitle || ''}
                    onChange={e => setEditingCard({ ...editingCard, card: { ...editingCard.card, subtitle: e.target.value } })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#123578] mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingCard.card.description}
                  onChange={e => setEditingCard({ ...editingCard, card: { ...editingCard.card, description: e.target.value } })}
                  placeholder="Detailed card statement..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#123578] mb-1">Card Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCard.card.image || ''}
                    onChange={e => setEditingCard({ ...editingCard, card: { ...editingCard.card, image: e.target.value } })}
                    placeholder="Image URL or upload"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                  <input
                    type="file"
                    ref={cardImageFileRef}
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadImageFile(file);
                        if (url) setEditingCard({ ...editingCard, card: { ...editingCard.card, image: url } });
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => cardImageFileRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-[#EEF2F9] text-[#123578] text-xs font-bold"
                  >
                    Upload
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#123578] mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={editingCard.card.ctaText || ''}
                    onChange={e => setEditingCard({ ...editingCard, card: { ...editingCard.card, ctaText: e.target.value } })}
                    placeholder="e.g., View Case"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#123578] mb-1">Button Link</label>
                  <input
                    type="text"
                    value={editingCard.card.link || ''}
                    onChange={e => setEditingCard({ ...editingCard, card: { ...editingCard.card, link: e.target.value } })}
                    placeholder="e.g., /services or /contact"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6E8ED]">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#ED650B] text-white shadow-md"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: ADD / EDIT PORTFOLIO PROJECT */}
      {/* ------------------------------------------------------------- */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl my-6 overflow-hidden shadow-2xl border border-[#E6E8ED] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E6E8ED] flex items-center justify-between bg-[#F7F7F5] shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase bg-[#F07822]/10 text-[#F07822] px-2 py-0.5 rounded-md font-bold">
                    Full Case Study Studio
                  </span>
                  {editingProject.published ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Live on Website
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Draft (Unpublished)
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#173B75]">
                  {isNewProject ? 'Create Full Branding Case Study' : `Edit: ${editingProject.title}`}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewProject(editingProject as any)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-[#173B75]/20 hover:bg-[#EEF2F9] text-xs font-bold text-[#173B75] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Preview exact case study presentation before publishing"
                >
                  <Eye className="w-3.5 h-3.5 text-[#F07822]" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Subtabs */}
            <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-[#E6E8ED] bg-[#FFF9F1] overflow-x-auto shrink-0">
              {[
                { id: 'basics', label: '1. Overview & Cover', icon: Layers },
                { id: 'gallery', label: `2. Image Gallery (${editingProject.gallery?.length || 0})`, icon: ImageIcon },
                { id: 'video', label: '3. Brand Video / Film', icon: VideoIcon },
                { id: 'sections', label: `4. Case Study Sections (${editingProject.caseStudySections?.length || 0})`, icon: FileText },
                { id: 'services', label: '5. Services & Palette', icon: Sparkles }
              ].map(t => {
                const Icon = t.icon;
                const isCurrent = activeProjectTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveProjectTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[#173B75] text-white shadow-xs'
                        : 'text-[#173B75]/70 hover:text-[#173B75] hover:bg-white/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#F07822]' : 'text-[#173B75]'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleSaveProject} className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* TAB 1: OVERVIEW & BASICS */}
              {activeProjectTab === 'basics' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g., Roast Republic Coffee"
                        className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-[#E6E8ED] focus:outline-none focus:ring-2 focus:ring-[#173B75]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1">
                        Category *
                      </label>
                      <select
                        value={editingProject.category}
                        onChange={e => setEditingProject({ ...editingProject, category: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E6E8ED] bg-white font-bold text-[#173B75]"
                      >
                        {(siteContent?.portfolioCategories || ['Branding', 'Packaging', 'Creative Design', 'Performance Marketing', 'Video & Social']).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1">
                        Project Tagline / Headline Summary *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.tagline}
                        onChange={e => setEditingProject({ ...editingProject, tagline: e.target.value })}
                        placeholder="e.g., Artisanal single-origin cold brew packaging, visual identity and DTC storefront."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E6E8ED]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1">
                        Client / Project Year
                      </label>
                      <input
                        type="text"
                        value={editingProject.projectYear || ''}
                        onChange={e => setEditingProject({ ...editingProject, projectYear: e.target.value })}
                        placeholder="e.g., 2026 Milestone"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E6E8ED]"
                      />
                    </div>
                  </div>

                  {/* Primary Cover Image */}
                  <div className="bg-[#FFF9F1] p-4 rounded-2xl border border-[#E4D8C8] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75]">
                      Primary Showcase Cover Image *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={editingProject.image}
                        onChange={e => setEditingProject({ ...editingProject, image: e.target.value })}
                        placeholder="Paste image URL (https://... or /uploads/...)"
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImageFile(file);
                            if (url) setEditingProject({ ...editingProject, image: url });
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-[#173B75] text-xs font-bold text-white hover:bg-[#112d5a] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#F07822]" />
                        <span>Upload Cover</span>
                      </button>
                    </div>

                    {editingProject.image && (
                      <div className="h-44 rounded-xl overflow-hidden bg-[#EEF2F9] border border-[#E6E8ED]">
                        <img src={editingProject.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Overview Brief & Creative Strategy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1">
                        The Commercial Brief
                      </label>
                      <textarea
                        rows={4}
                        value={editingProject.brief || ''}
                        onChange={e => setEditingProject({ ...editingProject, brief: e.target.value })}
                        placeholder="Describe the client brief, business problem and goals..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1">
                        Creative & Strategic Approach
                      </label>
                      <textarea
                        rows={4}
                        value={editingProject.approach || ''}
                        onChange={e => setEditingProject({ ...editingProject, approach: e.target.value })}
                        placeholder="Describe our strategic direction, visual system craft and execution..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MULTIPLE IMAGES GALLERY (Upload, Reorder, Captions, Alt Text) */}
              {activeProjectTab === 'gallery' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between bg-[#F7F7F5] p-4 rounded-2xl border border-[#E6E8ED]">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
                        Multi-Image Gallery Showcase
                      </h4>
                      <p className="text-[11px] text-[#252A34]/70 mt-0.5">
                        Add packaging angles, logo guidelines, social ads, website mockups and behind-the-scenes assets.
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={projectGalleryInputRef}
                      multiple
                      onChange={async e => {
                        const files = Array.from(e.target.files || []);
                        for (const file of files) {
                          try {
                            const url = await uploadImageFile(file);
                            if (url) {
                              setEditingProject(prev => {
                                if (!prev) return null;
                                const existing = prev.gallery || [];
                                const newItem = {
                                  id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                                  type: 'image' as const,
                                  url,
                                  caption: file.name.replace(/\.[^/.]+$/, ''),
                                  altText: file.name.replace(/\.[^/.]+$/, ''),
                                  order: existing.length + 1
                                };
                                return { ...prev, gallery: [...existing, newItem] };
                              });
                            }
                          } catch (err: any) {
                            showToast(err.message || 'Error uploading file', 'error');
                          }
                        }
                        showToast(`Uploaded ${files.length} gallery image(s)!`);
                      }}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => projectGalleryInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-[#173B75] text-xs font-bold text-white hover:bg-[#112d5a] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#F07822]" />
                      <span>Add Images</span>
                    </button>
                  </div>

                  {/* Gallery Items Grid */}
                  {(!editingProject.gallery || editingProject.gallery.length === 0) ? (
                    <div className="text-center py-10 bg-[#F7F7F5] rounded-2xl border border-dashed border-[#E6E8ED] text-xs text-[#252A34]/60 space-y-2">
                      <ImageIcon className="w-8 h-8 text-[#173B75]/30 mx-auto" />
                      <p>No extra gallery images added yet.</p>
                      <p className="text-[11px]">Click "Add Images" to upload multiple high-resolution case study assets.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingProject.gallery.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-white rounded-2xl border border-[#E6E8ED] shadow-2xs"
                        >
                          <img
                            src={item.url}
                            alt={item.altText || 'Gallery item'}
                            className="w-20 h-16 rounded-xl object-cover border shrink-0"
                          />

                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                            <input
                              type="text"
                              value={item.caption || ''}
                              onChange={e => {
                                const next = [...(editingProject.gallery || [])];
                                next[idx].caption = e.target.value;
                                setEditingProject({ ...editingProject, gallery: next });
                              }}
                              placeholder="Image Caption / Description"
                              className="px-3 py-1.5 text-xs rounded-lg border border-[#E6E8ED]"
                            />
                            <input
                              type="text"
                              value={item.altText || ''}
                              onChange={e => {
                                const next = [...(editingProject.gallery || [])];
                                next[idx].altText = e.target.value;
                                setEditingProject({ ...editingProject, gallery: next });
                              }}
                              placeholder="Image Alt Text (SEO)"
                              className="px-3 py-1.5 text-xs rounded-lg border border-[#E6E8ED]"
                            />
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
                            {/* Move Up */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const next = [...(editingProject.gallery || [])];
                                const temp = next[idx - 1];
                                next[idx - 1] = next[idx];
                                next[idx] = temp;
                                setEditingProject({ ...editingProject, gallery: next });
                              }}
                              className="p-1.5 rounded-lg border border-[#E6E8ED] hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                              title="Move up"
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-[#173B75]" />
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              disabled={idx === (editingProject.gallery?.length || 0) - 1}
                              onClick={() => {
                                const next = [...(editingProject.gallery || [])];
                                const temp = next[idx + 1];
                                next[idx + 1] = next[idx];
                                next[idx] = temp;
                                setEditingProject({ ...editingProject, gallery: next });
                              }}
                              className="p-1.5 rounded-lg border border-[#E6E8ED] hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                              title="Move down"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-[#173B75]" />
                            </button>

                            {/* Set as Cover */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProject({ ...editingProject, image: item.url });
                                showToast('Set as primary cover image!');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#EEF2F9] text-[#173B75] hover:bg-[#173B75] hover:text-white transition-colors cursor-pointer"
                              title="Set as primary cover image"
                            >
                              Set Cover
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingProject.gallery || []).filter((_, i) => i !== idx);
                                setEditingProject({ ...editingProject, gallery: next });
                              }}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
                              title="Delete media item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BRAND VIDEO / FILM */}
              {activeProjectTab === 'video' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E4D8C8] space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
                        Case Study Brand Video / Reel Presentation
                      </h4>
                      <p className="text-[11px] text-[#252A34]/70 mt-0.5">
                        Upload or embed an MP4/WebM video reel, motion graphics showcase, or origin brand film.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                        Video Media File or Public URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProject.videoUrl || ''}
                          onChange={e => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                          placeholder="Paste video URL (/uploads/... or https://...)"
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white"
                        />
                        <input
                          type="file"
                          ref={projectVideoInputRef}
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await uploadImageFile(file);
                                if (url) {
                                  setEditingProject({ ...editingProject, videoUrl: url });
                                  showToast('Project video uploaded!');
                                }
                              } catch (err: any) {
                                showToast(err.message || 'Failed to upload video', 'error');
                              }
                            }
                          }}
                          accept="video/mp4,video/webm,video/quicktime,video/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => projectVideoInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-[#173B75] text-xs font-bold text-white hover:bg-[#112d5a] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#F07822]" />
                          <span>Upload Video</span>
                        </button>
                        {editingProject.videoUrl && (
                          <button
                            type="button"
                            onClick={() => setEditingProject({ ...editingProject, videoUrl: '' })}
                            className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Remove video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#173B75] mb-1">
                        Video Poster Image (Thumbnail before playback)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProject.videoPoster || ''}
                          onChange={e => setEditingProject({ ...editingProject, videoPoster: e.target.value })}
                          placeholder="Paste poster image URL"
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white"
                        />
                        <input
                          type="file"
                          ref={projectVideoPosterInputRef}
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadImageFile(file);
                              if (url) {
                                setEditingProject({ ...editingProject, videoPoster: url });
                                showToast('Video poster uploaded!');
                              }
                            }
                          }}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => projectVideoPosterInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-[#EEF2F9] text-xs font-bold text-[#173B75] hover:bg-[#173B75] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#F07822]" />
                          <span>Upload Poster</span>
                        </button>
                      </div>
                    </div>

                    {editingProject.videoUrl && (
                      <div className="pt-2">
                        <div className="text-xs font-bold text-[#173B75] mb-1">Live Video Preview:</div>
                        <video
                          src={editingProject.videoUrl}
                          poster={editingProject.videoPoster}
                          controls
                          className="w-full max-h-56 rounded-xl bg-black object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CASE STUDY CUSTOM SECTIONS (Add, Rename, Reorder, Delete) */}
              {activeProjectTab === 'sections' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between bg-[#F7F7F5] p-4 rounded-2xl border border-[#E6E8ED]">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
                        Structured Case Study Narrative Sections
                      </h4>
                      <p className="text-[11px] text-[#252A34]/70 mt-0.5">
                        Break down the case study into custom sections: Strategy, Visual Identity, Packaging, Digital, Process.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const existing = editingProject.caseStudySections || [];
                        const newSec = {
                          id: `sec-${Date.now()}`,
                          title: `Section 0${existing.length + 1}: Creative Architecture`,
                          content: 'Outline the execution details, rationale, typography, and commercial results...',
                          order: existing.length + 1
                        };
                        setEditingProject({
                          ...editingProject,
                          caseStudySections: [...existing, newSec]
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-[#173B75] text-xs font-bold text-white hover:bg-[#112d5a] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#F07822]" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  {(!editingProject.caseStudySections || editingProject.caseStudySections.length === 0) ? (
                    <div className="text-center py-10 bg-[#F7F7F5] rounded-2xl border border-dashed border-[#E6E8ED] text-xs text-[#252A34]/60 space-y-2">
                      <FileText className="w-8 h-8 text-[#173B75]/30 mx-auto" />
                      <p>No custom sections configured yet.</p>
                      <p className="text-[11px]">Click "Add Section" to create bespoke narrative sections for this brand.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editingProject.caseStudySections.map((sec, idx) => (
                        <div
                          key={sec.id || idx}
                          className="bg-white p-4 rounded-2xl border border-[#E6E8ED] shadow-2xs space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold uppercase text-[#173B75] mb-1">
                                Section Title (Rename)
                              </label>
                              <input
                                type="text"
                                value={sec.title}
                                onChange={e => {
                                  const next = [...(editingProject.caseStudySections || [])];
                                  next[idx].title = e.target.value;
                                  setEditingProject({ ...editingProject, caseStudySections: next });
                                }}
                                className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E6E8ED]"
                              />
                            </div>

                            <div className="flex items-center gap-1 shrink-0 pt-4">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const next = [...(editingProject.caseStudySections || [])];
                                  const temp = next[idx - 1];
                                  next[idx - 1] = next[idx];
                                  next[idx] = temp;
                                  setEditingProject({ ...editingProject, caseStudySections: next });
                                }}
                                className="p-1.5 rounded-lg border border-[#E6E8ED] hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                title="Move section up"
                              >
                                <ArrowUp className="w-3.5 h-3.5 text-[#173B75]" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === (editingProject.caseStudySections?.length || 0) - 1}
                                onClick={() => {
                                  const next = [...(editingProject.caseStudySections || [])];
                                  const temp = next[idx + 1];
                                  next[idx + 1] = next[idx];
                                  next[idx] = temp;
                                  setEditingProject({ ...editingProject, caseStudySections: next });
                                }}
                                className="p-1.5 rounded-lg border border-[#E6E8ED] hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                title="Move section down"
                              >
                                <ArrowDown className="w-3.5 h-3.5 text-[#173B75]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (editingProject.caseStudySections || []).filter((_, i) => i !== idx);
                                  setEditingProject({ ...editingProject, caseStudySections: next });
                                }}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Delete section"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#173B75] mb-1">
                              Section Narrative Content
                            </label>
                            <textarea
                              rows={3}
                              value={sec.content}
                              onChange={e => {
                                const next = [...(editingProject.caseStudySections || [])];
                                next[idx].content = e.target.value;
                                setEditingProject({ ...editingProject, caseStudySections: next });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E6E8ED]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#173B75] mb-1">
                              Optional Section Image URL
                            </label>
                            <input
                              type="text"
                              value={sec.image || ''}
                              onChange={e => {
                                const next = [...(editingProject.caseStudySections || [])];
                                next[idx].image = e.target.value;
                                setEditingProject({ ...editingProject, caseStudySections: next });
                              }}
                              placeholder="Image URL to display alongside this section"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E6E8ED]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SERVICES & SPECS */}
              {activeProjectTab === 'services' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Associated Services */}
                  <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E4D8C8] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75]">
                      Associate Project with Relevant Studio Services
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Branding & Packaging',
                        'Creative Design',
                        'Performance Marketing Creatives',
                        'Video Production & Editing',
                        'Digital Marketing & Social Media Management'
                      ].map(srv => {
                        const isAssociated = (editingProject.associatedServices || []).includes(srv);
                        return (
                          <label
                            key={srv}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                              isAssociated
                                ? 'bg-white border-[#173B75] shadow-xs'
                                : 'bg-white/60 border-[#E6E8ED]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isAssociated}
                              onChange={e => {
                                const cur = editingProject.associatedServices || [];
                                const next = e.target.checked
                                  ? [...cur, srv]
                                  : cur.filter(s => s !== srv);
                                setEditingProject({ ...editingProject, associatedServices: next });
                              }}
                              className="w-4 h-4 text-[#F07822] rounded"
                            />
                            <span className="text-xs font-bold text-[#173B75]">{srv}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Palette Tokens */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E6E8ED] space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75]">
                      Brand Color Palette Tokens (Comma-separated HEX codes)
                    </label>
                    <input
                      type="text"
                      value={(editingProject.colorPalette || []).join(', ')}
                      onChange={e => {
                        const hexes = e.target.value.split(',').map(h => h.trim()).filter(Boolean);
                        setEditingProject({ ...editingProject, colorPalette: hexes });
                      }}
                      placeholder="#173B75, #FFF9F1, #2458A6, #252A34, #F07822"
                      className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-[#E6E8ED]"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      {(editingProject.colorPalette || ['#173B75', '#FFF9F1', '#2458A6', '#252A34', '#F07822']).map((hex, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-[#F7F7F5] text-[11px] font-mono">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                          <span>{hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E6E8ED] space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#173B75]">
                      Deliverables Checklist (Comma-separated)
                    </label>
                    <textarea
                      rows={2}
                      value={(editingProject.deliverables || []).join(', ')}
                      onChange={e => {
                        const items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setEditingProject({ ...editingProject, deliverables: items });
                      }}
                      placeholder="Brand Guidelines, Vector Dielines, 3D Product Renders, Social Ad Templates, Master Video Cutdowns"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                    />
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#173B75] mb-1">Format</label>
                      <input
                        type="text"
                        value={editingProject.specs?.format || ''}
                        onChange={e => setEditingProject({
                          ...editingProject,
                          specs: { ...editingProject.specs, format: e.target.value }
                        })}
                        placeholder="Vector Master AI, PDF Dielines"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6E8ED]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#173B75] mb-1">Timeline</label>
                      <input
                        type="text"
                        value={editingProject.specs?.timeline || ''}
                        onChange={e => setEditingProject({
                          ...editingProject,
                          specs: { ...editingProject.specs, timeline: e.target.value }
                        })}
                        placeholder="3–4 Weeks"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6E8ED]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#173B75] mb-1">Creative Tools</label>
                      <input
                        type="text"
                        value={editingProject.specs?.tools || ''}
                        onChange={e => setEditingProject({
                          ...editingProject,
                          specs: { ...editingProject.specs, tools: e.target.value }
                        })}
                        placeholder="Illustrator, Figma, Premiere"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E6E8ED]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Status and Visibility Settings */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E6E8ED] bg-[#F7F7F5] p-4 rounded-2xl">
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.isConcept}
                      onChange={e => setEditingProject({ ...editingProject, isConcept: e.target.checked })}
                      className="w-4 h-4 text-[#F07822] rounded"
                    />
                    <span className="text-xs font-bold text-[#173B75]">Spec Creative Concept</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.published}
                      onChange={e => setEditingProject({ ...editingProject, published: e.target.checked })}
                      className="w-4 h-4 text-[#F07822] rounded"
                    />
                    <span className="text-xs font-bold text-[#173B75]">Published Live to Portfolio</span>
                  </label>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setPreviewProject(editingProject as any)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-[#173B75]/30 hover:bg-white text-[#173B75] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#F07822]" />
                    <span>Preview Modal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED] bg-white hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 text-xs font-bold rounded-xl bg-[#F07822] hover:bg-[#d65805] text-white shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save & Publish Case Study'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: ADD / EDIT SERVICE CONCEPT */}
      {/* ------------------------------------------------------------- */}
      {editingConcept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#E6E8ED] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E6E8ED] flex items-center justify-between bg-[#F7F7F5]">
              <h3 className="text-base font-black text-[#123578]">
                {isNewConcept ? 'Create Service Concept' : `Edit: ${editingConcept.title}`}
              </h3>
              <button onClick={() => setEditingConcept(null)} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConcept} className="p-6 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Target Discipline *</label>
                <select
                  value={editingConcept.serviceId}
                  onChange={e => setEditingConcept({ ...editingConcept, serviceId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white font-bold"
                >
                  <option value="branding">Branding & Packaging</option>
                  <option value="creative">Creative Design & Amazon A+</option>
                  <option value="performance">Performance Marketing Creatives</option>
                  <option value="video">Video Production & Editing</option>
                  <option value="digital">Digital Marketing & Social Media</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Concept Title *</label>
                <input
                  type="text"
                  required
                  value={editingConcept.title}
                  onChange={e => setEditingConcept({ ...editingConcept, title: e.target.value })}
                  placeholder="e.g., Artisanal Amber Glass Olive Oil Series"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Client / Brand Name</label>
                <input
                  type="text"
                  value={editingConcept.clientName || ''}
                  onChange={e => setEditingConcept({ ...editingConcept, clientName: e.target.value })}
                  placeholder="e.g., Kaveri Botanicals or Studio Spec"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingConcept.tagline}
                  onChange={e => setEditingConcept({ ...editingConcept, tagline: e.target.value })}
                  placeholder="e.g., Tactile label dielines with gold foil finish"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#123578] mb-1">Concept Image *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingConcept.image}
                    onChange={e => setEditingConcept({ ...editingConcept, image: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                  <input
                    type="file"
                    ref={conceptImageFileRef}
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadImageFile(file);
                        if (url) setEditingConcept({ ...editingConcept, image: url });
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => conceptImageFileRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-[#EEF2F9] text-xs font-bold text-[#123578]"
                  >
                    Upload
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingConcept.published}
                    onChange={e => setEditingConcept({ ...editingConcept, published: e.target.checked })}
                    className="w-4 h-4 text-[#ED650B] rounded"
                  />
                  <span className="text-xs font-bold text-[#123578]">Publish on Services page</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E6E8ED]">
                <button
                  type="button"
                  onClick={() => setEditingConcept(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#ED650B] text-white shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Concept'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: ADD / EDIT BRAND */}
      {/* ------------------------------------------------------------- */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#E6E8ED] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E6E8ED] flex items-center justify-between bg-[#F7F7F5]">
              <h3 className="text-base font-black text-[#123578]">
                {isNewBrand ? 'Add Brand to Marquee' : `Edit Brand: ${editingBrand.name}`}
              </h3>
              <button onClick={() => setEditingBrand(null)} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#123578] mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={editingBrand.name}
                  onChange={e => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#123578] mb-1">Brand Logo</label>
                <input
                  type="file"
                  ref={brandFileRef}
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadImageFile(file);
                      if (url) setEditingBrand({ ...editingBrand, logoUrl: url });
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => brandFileRef.current?.click()}
                  className="w-full py-2.5 px-4 mb-2 rounded-xl bg-[#EEF2F9] text-xs font-bold text-[#123578] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#ED650B]" />
                  <span>Upload Brand Logo Image</span>
                </button>
                <input
                  type="text"
                  value={editingBrand.logoUrl || ''}
                  onChange={e => setEditingBrand({ ...editingBrand, logoUrl: e.target.value })}
                  placeholder="Or enter logo URL"
                  className="w-full px-4 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeBrand"
                  checked={editingBrand.active}
                  onChange={e => setEditingBrand({ ...editingBrand, active: e.target.checked })}
                  className="w-4 h-4 text-[#ED650B] rounded"
                />
                <label htmlFor="activeBrand" className="text-xs font-bold text-[#123578] cursor-pointer">
                  Show in continuous Trusted By marquee
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E6E8ED]">
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#ED650B] text-white shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 5: ADD / EDIT TESTIMONIAL */}
      {/* ------------------------------------------------------------- */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#E6E8ED] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E6E8ED] flex items-center justify-between bg-[#F7F7F5]">
              <h3 className="text-base font-black text-[#123578]">
                {isNewTestimonial ? 'Add Client Review' : `Edit Review: ${editingTestimonial.clientName}`}
              </h3>
              <button onClick={() => setEditingTestimonial(null)} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#123578] mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.clientName}
                    onChange={e => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#123578] mb-1">Company Name</label>
                  <input
                    type="text"
                    value={editingTestimonial.company}
                    onChange={e => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#123578] mb-1">Star Rating (1 - 5)</label>
                <select
                  value={editingTestimonial.rating}
                  onChange={e => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED] bg-white font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#123578] mb-1">Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.text}
                  onChange={e => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#123578] mb-1">Client Photo</label>
                <input
                  type="file"
                  ref={clientPhotoRef}
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadImageFile(file);
                      if (url) setEditingTestimonial({ ...editingTestimonial, photoUrl: url });
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => clientPhotoRef.current?.click()}
                  className="w-full py-2 px-3 mb-2 rounded-xl bg-[#EEF2F9] text-xs font-bold text-[#123578] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#ED650B]" />
                  <span>Upload Client Headshot</span>
                </button>
                <input
                  type="text"
                  value={editingTestimonial.photoUrl || ''}
                  onChange={e => setEditingTestimonial({ ...editingTestimonial, photoUrl: e.target.value })}
                  placeholder="Or enter photo URL"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeTestimonial"
                  checked={editingTestimonial.published}
                  onChange={e => setEditingTestimonial({ ...editingTestimonial, published: e.target.checked })}
                  className="w-4 h-4 text-[#ED650B] rounded"
                />
                <label htmlFor="activeTestimonial" className="text-xs font-bold text-[#123578] cursor-pointer">
                  Publish on public website
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E6E8ED]">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#ED650B] text-white shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 6: PUBLISH CHANGES LIVE CONFIRMATION */}
      {/* ------------------------------------------------------------- */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#E6E8ED] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E6E8ED] bg-[#123578] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ED650B]" />
                  <h3 className="text-base font-black">Publish Changes to Live Website</h3>
                </div>
                <button onClick={() => setShowPublishModal(false)} className="text-white/70 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-white/80 mt-1">
                This will instantly push all saved headlines, sections, hero slides, and brand settings to all public visitors.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#123578] mb-1">
                  Release Note / Version Label (Optional)
                </label>
                <input
                  type="text"
                  value={publishLabel}
                  onChange={e => setPublishLabel(e.target.value)}
                  placeholder="e.g., Autumn Hero Refresh & New FMCG Section"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#E6E8ED]"
                />
                <span className="text-[10px] text-[#242832]/60 mt-1 block">
                  A snapshot will be recorded in Version History for 1-click rollback anytime.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F7F5] border border-[#E6E8ED] text-xs text-[#242832]/80 space-y-1">
                <div className="font-bold text-[#123578] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ready to Deploy:</span>
                </div>
                <ul className="list-disc pl-5 text-[11px] text-[#242832]/70 space-y-0.5">
                  <li>{customSections.filter(s => s.published).length} Custom sections active</li>
                  <li>{portfolioProjects.filter(p => p.published).length} Portfolio projects published</li>
                  <li>{trustedBrands.filter(b => b.active).length} Trusted brands in marquee</li>
                  <li>All updated copy, headings, and hero showcase slides</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E6E8ED]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublishLive}
                  disabled={publishing}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#ED650B] hover:bg-[#d65805] text-white shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{publishing ? 'Publishing Live...' : 'Confirm & Publish Live'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 7: VERSION HISTORY & 1-CLICK RESTORE */}
      {/* ------------------------------------------------------------- */}
      {showVersionsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-[#E6E8ED] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E6E8ED] bg-[#F7F7F5] flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#123578] flex items-center gap-2">
                  <History className="w-4 h-4 text-[#ED650B]" />
                  <span>Website Version History & Rollback</span>
                </h3>
                <p className="text-xs text-[#242832]/70">
                  Every published release creates an immutable snapshot. Restore any previous state with 1 click.
                </p>
              </div>
              <button onClick={() => setShowVersionsModal(false)} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {contentVersions.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#242832]/60 italic">
                  No previous snapshots recorded yet. The first snapshot will be created upon your first live publish.
                </div>
              ) : (
                contentVersions.map((v, i) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl border border-[#E6E8ED] bg-[#F7F7F5] hover:bg-white flex items-center justify-between gap-4 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#123578]">{v.label}</span>
                        {i === 0 && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            Current Live
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#242832]/60 mt-0.5 font-mono">
                        {new Date(v.timestamp).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRestoreVersion(v.id)}
                      disabled={saving}
                      className="px-3 py-1.5 rounded-xl bg-[#123578] hover:bg-[#0d285b] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      Restore This Version
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 8: LIVE PROJECT DETAIL PREVIEW */}
      {/* ------------------------------------------------------------- */}
      {previewProject && (
        <ProjectDetailModal
          project={previewProject}
          onClose={() => setPreviewProject(null)}
          onOpenLetsTalk={() => {
            showToast("Preview Mode: Let's Talk modal would open on the public website.", 'success');
          }}
        />
      )}
    </div>
  );
};
