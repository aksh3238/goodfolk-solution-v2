import React from 'react';
import { ArrowRight, Sparkles, Layers, Eye, CheckCircle2, Compass } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ServicesCreativeBannerProps {
  onOpenLetsTalk: () => void;
  onNavigate: (path: string) => void;
}

export const ServicesCreativeBanner: React.FC<ServicesCreativeBannerProps> = ({
  onOpenLetsTalk,
  onNavigate
}) => {
  const { siteContent } = useSiteContent();
  const banner = siteContent?.servicesBanner;

  // If explicitly disabled in CMS, return null
  if (banner && banner.enabled === false) {
    return null;
  }

  const heading = banner?.heading || 'Where Bold Strategy Meets Relentless Creative Craft.';
  const subheading = banner?.subheading || 'Branding, packaging dielines, and performance ad creative engineered for commercial resonance.';
  const ctaLabel = banner?.ctaLabel || 'Discuss Your Brief';
  const ctaDestination = banner?.ctaDestination || 'lets-talk';
  const badge = banner?.badge || 'Creative Direction & Campaign Art';
  const imageUrl = banner?.imageUrl;
  const focalPoint = banner?.focalPoint || 'center';

  const focalPointClass = {
    center: 'object-center',
    top: 'object-top',
    bottom: 'object-bottom',
    left: 'object-left',
    right: 'object-right'
  }[focalPoint] || 'object-center';

  const handleCtaClick = () => {
    if (!ctaDestination || ctaDestination === 'lets-talk' || ctaDestination === '#lets-talk') {
      onOpenLetsTalk();
    } else if (ctaDestination.startsWith('#')) {
      const el = document.querySelector(ctaDestination);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        onNavigate(`/services${ctaDestination}`);
      }
    } else if (ctaDestination.startsWith('/')) {
      onNavigate(ctaDestination);
    } else {
      onOpenLetsTalk();
    }
  };

  return (
    <section className="w-full my-12 lg:my-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-[#0A1628] text-white border border-[#2458A6]/30 shadow-2xl">
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2458A6]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#F07822]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

        {/* Studio Grid / Blueprint Overlay Lines */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-14">
          {/* Left Column: Minimal Punchy Copy & CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#F07822] animate-pulse" />
              <span className="tracking-wide uppercase text-[11px]">{badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              {heading}
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              {subheading}
            </p>

            {/* Micro Agency Specs Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-white/70">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
                <span>Brand Identity & Systems</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2458A6]" />
                <span>Retail Packaging Dielines</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
                <span>Performance Ad Architecture</span>
              </div>
            </div>

            {/* CTA Action Button */}
            <div className="pt-3">
              <button
                onClick={handleCtaClick}
                className="bg-[#F07822] hover:bg-[#d65805] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-[#F07822]/30 hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer group"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 text-white transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Campaign Art / Collage */}
          <div className="lg:col-span-6 relative">
            {imageUrl ? (
              /* Custom Uploaded Banner Image with Art-Directed Framing & Focal Point */
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/40 group">
                <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={heading}
                    className={`w-full h-full object-cover ${focalPointClass} group-hover:scale-105 transition-transform duration-700`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=2000&q=85';
                    }}
                  />
                </div>
                {/* Floating Agency Spec Chips */}
                <div className="absolute bottom-3 left-3 bg-[#0A1628]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-[11px] font-mono text-white/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
                  <span>GOODFOLK STUDIO // CAMPAIGN ART</span>
                </div>
              </div>
            ) : (
              /* Fallback Art-Directed Dynamic Agency Collage */
              <div className="relative h-80 sm:h-96 w-full flex items-center justify-center">
                {/* Layer 1: Background Packaging Card */}
                <div className="absolute top-2 right-4 w-60 sm:w-72 h-44 rounded-2xl bg-gradient-to-br from-[#173B75] to-[#0A1628] border border-white/20 shadow-2xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#F07822] mb-2">
                    <span>SPEC // DIELINE 04</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-white">PANTONE 288 C</span>
                  </div>
                  <div className="text-xs font-bold text-white">Tactile Retail Packaging</div>
                  <div className="mt-2 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white/60 font-mono">
                    [FOIL STAMP + EMBOSS SPECIFICATION]
                  </div>
                </div>

                {/* Layer 2: Performance Ad Motion Specimen */}
                <div className="absolute bottom-4 left-4 w-64 sm:w-72 h-48 rounded-2xl bg-[#122B54] border border-[#F07822]/40 shadow-2xl p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/80 mb-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F07822] animate-pulse" />
                      HIGH-RETENTION HOOK
                    </span>
                    <span className="text-[10px] text-[#F07822] font-bold">15s REEL</span>
                  </div>
                  <div className="text-sm font-black text-white">Dynamic Social Creative</div>
                  <p className="text-[11px] text-white/70 mt-1 line-clamp-2">
                    Framed for thumb-stopping retention and high conversion on Meta & Google Ads.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white">4:5 & 9:16</span>
                    <span className="text-[10px] font-mono bg-[#F07822]/20 text-[#F07822] px-2 py-0.5 rounded font-bold">A/B VARIATION</span>
                  </div>
                </div>

                {/* Layer 3: Central Golden Ratio Emblem Badge */}
                <div className="relative z-20 w-24 h-24 rounded-2xl bg-white text-[#173B75] p-3 shadow-2xl border-2 border-[#F07822] flex flex-col items-center justify-center text-center transform hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-[#F07822] mb-1" />
                  <span className="text-[9px] font-black tracking-wider uppercase">GOOD FOLK</span>
                  <span className="text-[8px] font-mono text-[#173B75]/70">CRAFT LAB</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
