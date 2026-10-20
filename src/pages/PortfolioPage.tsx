import React, { useState } from 'react';
import { PORTFOLIO_ITEMS } from '../data/portfolio';
import { ProjectDetailModal, PortfolioItem } from '../components/ProjectDetailModal';
import { ArrowRight, Eye, Sparkles, Layers, Tag, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { CtaMotionGraphic } from '../components/CtaMotionGraphic';

interface PortfolioPageProps {
  onOpenLetsTalk: () => void;
  onNavigate: (path: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenLetsTalk, onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const { portfolioProjects, siteContent } = useSiteContent();

  const filters = (siteContent.portfolioCategories && siteContent.portfolioCategories.length > 0)
    ? siteContent.portfolioCategories
    : [
        'All',
        'Branding',
        'Packaging',
        'Creative Design',
        'E-commerce',
        'Performance Marketing',
        'Video & Social'
      ];

  const sourceItems: PortfolioItem[] = (portfolioProjects && portfolioProjects.length > 0)
    ? portfolioProjects
        .filter(p => p.published !== false)
        .map(p => ({
          id: p.id,
          title: p.title,
          category: p.category as any,
          tagline: p.tagline,
          image: p.image,
          gallery: p.gallery,
          videoUrl: p.videoUrl,
          videoPoster: p.videoPoster,
          caseStudySections: p.caseStudySections,
          associatedServices: p.associatedServices,
          colorPalette: p.colorPalette,
          typographyNotes: p.typographyNotes,
          clientName: p.clientName,
          projectYear: p.projectYear,
          isConcept: p.isConcept,
          brief: p.brief,
          approach: p.approach,
          deliverables: p.deliverables,
          specs: p.specs
        }))
    : PORTFOLIO_ITEMS;

  const filteredItems = sourceItems.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'E-commerce') {
      return item.category === 'Creative Design' || item.category === 'Packaging' || (item as any).category === 'E-commerce';
    }
    return item.category === activeFilter;
  });

  return (
    <div className="pt-24 pb-0 overflow-hidden">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F9] text-[#173B75] text-xs font-semibold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
          Visual Direction & Craft
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#173B75] tracking-tight">
          Selected Work
        </h1>

        <p className="mt-3 text-base sm:text-lg text-[#242832]/80 max-w-2xl mx-auto leading-relaxed">
          Explore strategic creative concepts across packaging dielines, brand identities, e-commerce storefronts, and conversion marketing.
        </p>

        {/* Filter Bar with Item Counts */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {filters.map(filter => {
            const count = sourceItems.filter(item => {
              if (filter === 'All') return true;
              if (filter === 'E-commerce') {
                return item.category === 'Creative Design' || item.category === 'Packaging' || (item as any).category === 'E-commerce';
              }
              return item.category === filter;
            }).length;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === filter
                    ? 'bg-[#173B75] text-white shadow-md'
                    : 'bg-[#F7F7F5] hover:bg-[#EEF2F9] text-[#242832]/80 border border-[#E6E8ED]'
                }`}
              >
                <span>{filter}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeFilter === filter
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E6E8ED] text-[#242832]/70'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Editorial Varied Portfolio Layout (Balanced Spacing & Large Images) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-8">
          {/* Featured Lead Project Card (If available and matching filter) */}
          {filteredItems.length > 0 && activeFilter === 'All' && (
            <div
              onClick={() => setSelectedProject(filteredItems[0])}
              className="group bg-white rounded-3xl border border-[#E6E8ED] hover:border-[#173B75]/40 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-7 relative h-80 sm:h-[460px] overflow-hidden bg-[#EEF2F9]">
                <img
                  src={filteredItems[0].image}
                  alt={filteredItems[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-[#173B75] shadow-sm">
                    {filteredItems[0].category}
                  </span>
                  <span className="bg-[#173B75] text-white px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                    Featured Case Study
                  </span>
                </div>

                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/95 text-[#173B75] px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl">
                    <Eye className="w-4 h-4 text-[#F07822]" />
                    <span>View Complete Case Specs</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-[#F7F7F5]/40">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-[#F07822] tracking-wider">
                    Flagship Execution
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B75] mt-1 group-hover:text-[#F07822] transition-colors">
                    {filteredItems[0].title}
                  </h2>
                  <p className="mt-3 text-sm text-[#242832]/80 leading-relaxed">
                    {filteredItems[0].tagline}
                  </p>

                  {filteredItems[0].brief && (
                    <div className="mt-4 p-4 rounded-2xl bg-white border border-[#E6E8ED]">
                      <div className="text-[11px] font-bold text-[#173B75] uppercase tracking-wider mb-1">
                        Commercial Scope
                      </div>
                      <p className="text-xs text-[#242832]/75 leading-relaxed line-clamp-3">
                        {filteredItems[0].brief}
                      </p>
                    </div>
                  )}

                  {/* Deliverables Preview Tags */}
                  {filteredItems[0].deliverables && filteredItems[0].deliverables.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {filteredItems[0].deliverables.slice(0, 4).map((d, i) => (
                        <span
                          key={i}
                          className="bg-white px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#173B75] border border-[#E6E8ED] flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#F07822]" />
                          <span>{d}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-[#E6E8ED] flex items-center justify-between text-xs font-bold text-[#173B75] group-hover:text-[#F07822]">
                  <span>Explore Deliverables & Technical Specs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Grid for remaining projects (or all projects if category filtered) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(activeFilter === 'All' ? filteredItems.slice(1) : filteredItems).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedProject(item)}
                className="group bg-white rounded-3xl border border-[#E6E8ED] hover:border-[#173B75]/40 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative h-72 sm:h-80 overflow-hidden bg-[#EEF2F9]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/95 text-[#173B75] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-4 h-4 text-[#F07822]" />
                      <span>View Case Details</span>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-[#173B75] shadow-sm">
                    {item.category}
                  </div>

                  {item.isConcept && (
                    <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-medium text-white border border-white/20">
                      Concept Studio
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-[#173B75] group-hover:text-[#F07822] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#242832]/75 leading-relaxed">
                      {item.tagline}
                    </p>

                    {/* Deliverables preview pills */}
                    {item.deliverables && item.deliverables.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.deliverables.slice(0, 3).map((del, dIdx) => (
                          <span
                            key={dIdx}
                            className="bg-[#F7F7F5] px-2 py-0.5 rounded-md text-[10px] font-medium text-[#242832]/80 border border-[#E6E8ED]"
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E6E8ED] flex items-center justify-between text-xs font-semibold text-[#173B75] group-hover:text-[#F07822]">
                    <span>Explore Deliverables & Scope</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-[#F7F7F5] rounded-3xl border border-[#E6E8ED]">
              <p className="text-sm text-[#242832]/70 font-medium">
                No projects currently published in category "{activeFilter}".
              </p>
              <button
                onClick={() => setActiveFilter('All')}
                className="mt-3 text-xs font-bold text-[#F07822] underline cursor-pointer"
              >
                Reset to All Projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FULL-WIDTH CLOSING CTA BANNER (Edge-to-Edge across viewport, matching Homepage) */}
      <section className="w-full bg-[#173B75] text-white py-16 sm:py-20 relative overflow-hidden mt-16 sm:mt-24">
        <CtaMotionGraphic className="opacity-80" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F07822]">
            Let's Collaborate
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Have a project in mind? Let's create something meaningful.
          </h2>
          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            Whether launching a new consumer brand or refreshing existing packaging, we are ready to partner with you.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/contact')}
              className="bg-[#F07822] hover:bg-[#d65805] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-[#F07822]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLetsTalk}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all border border-white/20 hover:border-white/40 cursor-pointer flex items-center gap-2"
            >
              <span>Let's Talk</span>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </button>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenLetsTalk={onOpenLetsTalk}
      />
    </div>
  );
};
