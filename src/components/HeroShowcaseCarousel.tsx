import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import type { CMSHeroSlide } from '../types';

export const DEFAULT_HERO_SLIDES: CMSHeroSlide[] = [
  {
    id: 'branding-packaging',
    category: 'Branding & Packaging',
    title: 'Packaging & Brand Identity',
    imageUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=80',
    targetPath: '/services#branding'
  },
  {
    id: 'performance-marketing',
    category: 'Performance Marketing',
    title: 'Performance Ad Creatives & Growth',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    targetPath: '/services#performance'
  },
  {
    id: 'promotional-videos',
    category: 'Video Production',
    title: 'Cinematic Product Reels & Motion',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    targetPath: '/services#video'
  },
  {
    id: 'cost-efficiency',
    category: 'Creative Optimization',
    title: 'Ad Spend & CAC Optimization',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    targetPath: '/services#performance'
  },
  {
    id: 'brand-projects',
    category: 'Creative Portfolio',
    title: 'Comprehensive Brand Direction',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80',
    targetPath: '/portfolio'
  }
];

interface HeroShowcaseCarouselProps {
  onNavigate?: (path: string) => void;
}

export const HeroShowcaseCarousel: React.FC<HeroShowcaseCarouselProps> = ({ onNavigate }) => {
  const { siteContent } = useSiteContent();
  const slides = (siteContent.heroSlides && siteContent.heroSlides.length > 0)
    ? siteContent.heroSlides
    : DEFAULT_HERO_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep currentIndex bounded if slides change
  const safeIndex = currentIndex % slides.length;
  const currentSlide = slides[safeIndex] || slides[0];

  // Automatic Transitions:
  // - On hover: smoothly transition to next slide within ~1.5 to 2 seconds, and keep cycling while hovering.
  // - Default / Mobile: sensible cadence (~4 seconds).
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const intervalMs = isHovered ? 1800 : 4000;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isHovered, slides.length]);

  // Clickable Service Navigation:
  // Clicking anywhere on the active card opens its corresponding service section or page
  const handleSlideClick = () => {
    if (currentSlide.targetPath) {
      if (onNavigate) {
        onNavigate(currentSlide.targetPath);
      } else {
        window.location.href = currentSlide.targetPath;
      }
    }
  };

  return (
    <div
      className="relative mx-auto max-w-md lg:max-w-none select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Interactive Main Showcase Card */}
      <div
        onClick={handleSlideClick}
        role="link"
        tabIndex={0}
        aria-label={`View ${currentSlide.title} (${currentSlide.category})`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSlideClick();
          }
        }}
        className="group relative rounded-3xl overflow-hidden shadow-2xl border border-[#E6E8ED]/80 bg-white cursor-pointer transition-all duration-500 hover:shadow-3xl hover:border-[#173B75]/30"
      >
        {/* Visually dominant image area with crossfade transitions */}
        <div className="relative h-84 sm:h-[480px] lg:h-[500px] w-full overflow-hidden bg-[#173B75]/5">
          {slides.map((slide, idx) => {
            const isActive = idx === safeIndex;
            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${
                    isActive ? 'scale-100' : 'scale-105'
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
            );
          })}

          {/* Elegant gradient overlay: deep navy at bottom for crisp readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#173B75]/95 via-[#173B75]/30 to-transparent z-20 pointer-events-none" />

          {/* Minimal, Clean & Premium Bottom Overlay (Display only short service title & small category label) */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 z-30 flex items-end justify-between gap-4 pointer-events-none">
            <div className="space-y-2 max-w-[82%]">
              {/* Small Category Label */}
              {currentSlide.category && (
                <div>
                  <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-[#F07822] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                    {currentSlide.category}
                  </span>
                </div>
              )}

              {/* Short Service Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md leading-tight">
                {currentSlide.title}
              </h3>
            </div>

            {/* Subtle clickable indicator arrow that highlights on hover */}
            <div
              className="shrink-0 w-11 h-11 rounded-full bg-white/95 text-[#173B75] group-hover:bg-[#F07822] group-hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#F07822]/30"
              aria-hidden="true"
            >
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
