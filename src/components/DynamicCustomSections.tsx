import React from 'react';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import type { CMSCustomSection, CMSSectionCard } from '../types';
import { FocusCardGroup, FocusCardItem } from './FocusCardGroup';

interface DynamicCustomSectionsProps {
  sections: CMSCustomSection[];
  onNavigate?: (path: string) => void;
  onOpenLetsTalk?: () => void;
}

export const DynamicCustomSections: React.FC<DynamicCustomSectionsProps> = ({
  sections,
  onNavigate,
  onOpenLetsTalk
}) => {
  const publishedSections = (sections || []).filter(s => s && s.published !== false);

  if (publishedSections.length === 0) return null;

  const handleCtaClick = (link?: string) => {
    if (!link) {
      if (onOpenLetsTalk) onOpenLetsTalk();
      return;
    }
    if (link.startsWith('#')) {
      const el = document.getElementById(link.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else if (onNavigate) {
      onNavigate(link);
    }
  };

  return (
    <div className="space-y-16">
      {publishedSections.map((sec) => (
        <section
          key={sec.id}
          className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E6E8ED]/70 first:border-t-0 animate-in fade-in duration-300"
        >
          {/* Section Header */}
          {(sec.title || sec.badge || sec.description) && (
            <div className="text-center max-w-3xl mx-auto mb-12">
              {sec.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F9] text-[#173B75] text-xs font-bold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
                  {sec.badge}
                </div>
              )}
              {sec.title && (
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B75] tracking-tight">
                  {sec.title}
                </h2>
              )}
              {sec.subtitle && (
                <p className="text-sm font-semibold text-[#F07822] mt-1">
                  {sec.subtitle}
                </p>
              )}
              {sec.description && (
                <p className="mt-3 text-sm sm:text-base text-[#242832]/80 leading-relaxed">
                  {sec.description}
                </p>
              )}
            </div>
          )}

          {/* Layout 1: CARDS */}
          {sec.layout === 'cards' && sec.cards && sec.cards.length > 0 && (
            <FocusCardGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sec.cards.map((card, idx) => (
                <FocusCardItem key={card.id || idx} index={idx} className="h-full">
                  <div className="bg-white rounded-3xl p-6 border border-[#E6E8ED] shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                    <div>
                      {card.image && (
                        <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 bg-[#EEF2F9] border border-[#E6E8ED]">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        </div>
                      )}
                      {card.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F07822] bg-[#F07822]/10 px-2 py-0.5 rounded-md mb-2 inline-block">
                          {card.badge}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-[#173B75]">{card.title}</h3>
                      {card.subtitle && (
                        <div className="text-xs font-semibold text-[#242832]/60 mt-0.5">{card.subtitle}</div>
                      )}
                      <p className="mt-2 text-xs sm:text-sm text-[#242832]/80 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {(card.link || card.ctaText) && (
                      <div className="mt-6 pt-4 border-t border-[#E6E8ED] flex items-center justify-between">
                        <button
                          onClick={() => handleCtaClick(card.link)}
                          className="text-xs font-bold text-[#F07822] hover:text-[#173B75] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{card.ctaText || 'Learn More'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </FocusCardItem>
              ))}
            </FocusCardGroup>
          )}

          {/* Layout 2: FEATURES */}
          {sec.layout === 'features' && sec.cards && sec.cards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sec.cards.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="bg-[#F7F7F5] rounded-3xl p-8 border border-[#E6E8ED] flex flex-col sm:flex-row items-start gap-6 hover:bg-white hover:shadow-md transition-all"
                >
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#E6E8ED]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#173B75] text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-[#F07822]" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    {card.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F07822]">
                        {card.badge}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-[#173B75]">{card.title}</h3>
                    <p className="text-xs sm:text-sm text-[#242832]/80 leading-relaxed">
                      {card.description}
                    </p>
                    {(card.link || card.ctaText) && (
                      <button
                        onClick={() => handleCtaClick(card.link)}
                        className="text-xs font-bold text-[#F07822] hover:text-[#173B75] flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <span>{card.ctaText || 'Explore'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Layout 3: BANNER */}
          {sec.layout === 'banner' && (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#173B75] to-[#0d285b] text-white p-8 sm:p-14 shadow-xl">
              {sec.bannerImage && (
                <div className="absolute inset-0 z-0 opacity-25">
                  <img src={sec.bannerImage} alt="Banner background" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10 max-w-2xl space-y-4">
                {sec.badge && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F07822] bg-white/10 px-3 py-1 rounded-full">
                    {sec.badge}
                  </span>
                )}
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{sec.title}</h3>
                {sec.description && (
                  <p className="text-sm sm:text-base text-white/85 leading-relaxed">{sec.description}</p>
                )}
                {(sec.ctaText || sec.ctaLink) && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleCtaClick(sec.ctaLink)}
                      className="bg-[#F07822] hover:bg-[#d65805] text-white px-7 py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>{sec.ctaText || 'Get Started'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Layout 4: GRID */}
          {sec.layout === 'grid' && sec.cards && sec.cards.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sec.cards.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="bg-white rounded-2xl p-5 border border-[#E6E8ED] shadow-xs hover:border-[#173B75]/30 transition-all text-center flex flex-col items-center justify-between"
                >
                  {card.image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 bg-[#EEF2F9]">
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h4 className="text-sm font-bold text-[#173B75]">{card.title}</h4>
                  <p className="text-xs text-[#242832]/70 mt-1 line-clamp-3">{card.description}</p>
                  {card.link && (
                    <button
                      onClick={() => handleCtaClick(card.link)}
                      className="mt-3 text-[11px] font-bold text-[#F07822] hover:underline"
                    >
                      {card.ctaText || 'View'} &rarr;
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Layout 5: TEXT-SPLIT */}
          {sec.layout === 'text-split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#F7F7F5] rounded-3xl p-8 sm:p-12 border border-[#E6E8ED]">
              <div className="lg:col-span-7 space-y-4">
                {sec.badge && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F07822]">
                    {sec.badge}
                  </span>
                )}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#173B75]">{sec.title}</h3>
                {sec.description && (
                  <p className="text-sm sm:text-base text-[#242832]/85 leading-relaxed">{sec.description}</p>
                )}
                {sec.cards && sec.cards.length > 0 && (
                  <div className="space-y-3 pt-3">
                    {sec.cards.map((c, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#F07822] mt-2 shrink-0" />
                        <div>
                          <strong className="text-xs sm:text-sm font-bold text-[#173B75]">{c.title}: </strong>
                          <span className="text-xs sm:text-sm text-[#242832]/80">{c.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {(sec.ctaText || sec.ctaLink) && (
                  <div className="pt-3">
                    <button
                      onClick={() => handleCtaClick(sec.ctaLink)}
                      className="bg-[#173B75] hover:bg-[#0d285b] text-white px-6 py-3 rounded-full text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>{sec.ctaText || "Learn More"}</span>
                      <ArrowRight className="w-4 h-4 text-[#F07822]" />
                    </button>
                  </div>
                )}
              </div>
              <div className="lg:col-span-5">
                {sec.bannerImage ? (
                  <img
                    src={sec.bannerImage}
                    alt={sec.title}
                    className="w-full h-80 rounded-2xl object-cover border border-[#E6E8ED] shadow-md"
                  />
                ) : (
                  <div className="w-full h-64 rounded-2xl bg-[#EEF2F9] flex items-center justify-center text-[#173B75] font-bold text-sm border border-[#E6E8ED]">
                    {sec.title}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section CTA Button (if provided at section level and not banner/split) */}
          {sec.layout !== 'banner' && sec.layout !== 'text-split' && (sec.ctaText || sec.ctaLink) && (
            <div className="text-center mt-10">
              <button
                onClick={() => handleCtaClick(sec.ctaLink)}
                className="bg-[#173B75] hover:bg-[#0d285b] text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{sec.ctaText || 'Explore More'}</span>
                <ArrowRight className="w-4 h-4 text-[#F07822]" />
              </button>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};
