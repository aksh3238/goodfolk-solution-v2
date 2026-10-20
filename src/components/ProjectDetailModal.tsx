import React, { useEffect, useState } from 'react';
import {
  X, Check, ArrowRight, Play, Pause, Volume2, VolumeX,
  ChevronLeft, ChevronRight, Layers, Sparkles, Tag, ExternalLink, Image as ImageIcon, Video as VideoIcon
} from 'lucide-react';
import type { PortfolioMediaItem, CaseStudySection } from '../types';

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Branding' | 'Packaging' | 'Creative Design' | 'E-commerce' | 'Performance Marketing' | 'Video & Social' | string;
  tagline: string;
  image: string;
  gallery?: PortfolioMediaItem[];
  videoUrl?: string;
  videoPoster?: string;
  caseStudySections?: CaseStudySection[];
  associatedServices?: string[];
  brandStrategy?: string;
  colorPalette?: string[];
  typographyNotes?: string;
  clientName?: string;
  projectYear?: string;
  isConcept: boolean;
  brief: string;
  approach: string;
  deliverables: string[];
  specs: {
    format: string;
    timeline: string;
    tools: string;
  };
}

interface ProjectDetailModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
  onOpenLetsTalk: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, onOpenLetsTalk }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setActiveMediaIndex(0);
      setIsPlayingVideo(false);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  // Aggregate media items: primary image + gallery items + video
  const mediaList: Array<{ type: 'image' | 'video'; url: string; poster?: string; caption?: string; altText?: string }> = [];

  // Add primary image
  if (project.image) {
    mediaList.push({
      type: 'image',
      url: project.image,
      caption: `${project.title} — Primary Concept Master View`,
      altText: project.title
    });
  }

  // Add video if present
  if (project.videoUrl) {
    mediaList.push({
      type: 'video',
      url: project.videoUrl,
      poster: project.videoPoster || project.image,
      caption: `${project.title} — Brand Presentation & Motion Showcase`,
      altText: `${project.title} Brand Film`
    });
  }

  // Add additional gallery items
  if (project.gallery && project.gallery.length > 0) {
    project.gallery.forEach((g) => {
      mediaList.push({
        type: g.type || 'image',
        url: g.url,
        poster: g.posterUrl,
        caption: g.caption || g.title,
        altText: g.altText || g.caption || project.title
      });
    });
  }

  const currentMedia = mediaList[activeMediaIndex] || mediaList[0];

  // Default rich case study sections if none stored in CMS
  const caseStudySections: CaseStudySection[] = (project.caseStudySections && project.caseStudySections.length > 0)
    ? project.caseStudySections
    : [
        {
          id: 'sec-1',
          title: 'Brand Strategy & Commercial Problem',
          content: project.brief || 'Target audience analysis, market positioning, and distinctive creative direction designed to elevate shelf presence and organic brand recall.',
          order: 1
        },
        {
          id: 'sec-2',
          title: 'Visual Architecture & Creative Execution',
          content: project.approach || 'Bespoke typographic rhythm, custom vector icons, packaging dieline engineering, and cohesive cross-platform visual systems.',
          order: 2
        }
      ];

  const defaultPalette = project.colorPalette && project.colorPalette.length > 0
    ? project.colorPalette
    : ['#173B75', '#FFF9F1', '#2458A6', '#252A34', '#F07822'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#173B75]/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#E6E8ED] overflow-hidden z-10 my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#F7F7F5] border-b border-[#E6E8ED] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F07822] bg-[#F07822]/10 px-2.5 py-0.5 rounded-md">
              {project.category}
            </span>
            {project.isConcept && (
              <span className="text-[11px] font-semibold bg-[#173B75] text-white px-2 py-0.5 rounded-md">
                Agency Concept
              </span>
            )}
            {project.projectYear && (
              <span className="text-[11px] text-[#252A34]/60 font-mono">
                · {project.projectYear}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            type="button"
            aria-label="Close project modal"
            className="w-9 h-9 rounded-full bg-white text-[#173B75] hover:bg-[#F07822] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer border border-[#E6E8ED]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Case Study Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Project Title & Overview */}
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#173B75] tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-[#252A34]/80 mt-2 max-w-3xl leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* MAIN MEDIA SHOWCASE (IMAGE / VIDEO) */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-[#EEF2F9] border border-[#E6E8ED] shadow-md aspect-video sm:aspect-16/9 flex items-center justify-center">
              {currentMedia?.type === 'video' ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    src={currentMedia.url}
                    poster={currentMedia.poster}
                    controls
                    autoPlay
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <img
                  src={currentMedia?.url}
                  alt={currentMedia?.altText || project.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Prev/Next arrows if multiple media */}
              {mediaList.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-md"
                    aria-label="Previous media"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveMediaIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-md"
                    aria-label="Next media"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Media Caption & Index */}
            {currentMedia?.caption && (
              <div className="flex items-center justify-between text-xs text-[#252A34]/70 px-1">
                <span>{currentMedia.caption}</span>
                <span className="font-mono text-[11px] text-[#173B75]">
                  {activeMediaIndex + 1} of {mediaList.length} Assets
                </span>
              </div>
            )}

            {/* Thumbnails Strip */}
            {mediaList.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1">
                {mediaList.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeMediaIndex === idx
                        ? 'border-[#F07822] shadow-md scale-105'
                        : 'border-[#E6E8ED] opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={m.type === 'video' ? (m.poster || m.url) : m.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {m.type === 'video' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <VideoIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILED CASE STUDY SECTIONS */}
          <div className="space-y-6 pt-2">
            <div className="border-b border-[#E6E8ED] pb-3">
              <h3 className="text-lg font-bold text-[#173B75]">
                Full Case Study & Brand Architecture
              </h3>
              <p className="text-xs text-[#252A34]/70 mt-0.5">
                From strategic concept and visual identity to packaging dielines and conversion creatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudySections.map((section, idx) => (
                <div
                  key={section.id || idx}
                  className="bg-[#FFF9F1] rounded-2xl p-5 border border-[#E4D8C8] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#173B75]">
                      {section.title}
                    </h4>
                    <span className="text-[10px] font-mono text-[#F07822] font-bold">
                      0{idx + 1}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#252A34]/85 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                  {section.image && (
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-40 object-cover rounded-xl mt-3 border border-[#E6E8ED]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COLOR PALETTE & TYPOGRAPHY SYSTEM */}
          <div className="bg-[#F7F7F5] rounded-2xl p-6 border border-[#E6E8ED] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
                  Color Palette & Identity Tokens
                </h4>
                <p className="text-[11px] text-[#252A34]/70">
                  Approved tonal hierarchy engineered for print dielines and high-contrast digital displays.
                </p>
              </div>
              <span className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-[#E6E8ED] text-[#173B75]">
                Poppins Typography
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {defaultPalette.map((hex, i) => (
                <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E6E8ED] shadow-2xs">
                  <span
                    className="w-6 h-6 rounded-lg border border-black/10 shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="font-mono text-xs font-bold text-[#173B75] uppercase">
                    {hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DELIVERABLES INCLUDED */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
              Deliverables & Master Assets Produced
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {project.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E6E8ED] text-xs font-medium text-[#252A34]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#F07822]/10 text-[#F07822] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SPECIFICATIONS & ASSOCIATED SERVICES */}
          <div className="bg-[#EEF2F9]/50 rounded-2xl p-5 border border-[#173B75]/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[#252A34]/60">Format & Assets:</span>
              <span className="ml-1.5 font-semibold text-[#173B75]">{project.specs?.format || 'Vector Master, Dielines, MP4 Reels'}</span>
            </div>
            <div>
              <span className="text-[#252A34]/60">Production Timeline:</span>
              <span className="ml-1.5 font-semibold text-[#173B75]">{project.specs?.timeline || '3–4 Weeks Collaborative Sprints'}</span>
            </div>
            <div>
              <span className="text-[#252A34]/60">Creative Stack:</span>
              <span className="ml-1.5 font-semibold text-[#173B75]">{project.specs?.tools || 'Illustrator, Figma, Premiere Pro, After Effects'}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="px-6 py-4 bg-[#F7F7F5] border-t border-[#E6E8ED] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <p className="text-xs text-[#252A34]/70 text-center sm:text-left">
            Looking for a complete branding case study or packaging suite tailored to your business?
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenLetsTalk();
              }}
              className="w-full sm:w-auto bg-[#F07822] hover:bg-[#d65805] text-white px-7 py-2.5 rounded-full text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Discuss Scope Like This</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
