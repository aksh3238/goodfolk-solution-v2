import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Sparkles, Compass, Users2, Mail, Phone, Star, User } from 'lucide-react';
import { SERVICES_DATA } from '../data/services';
import { EnquiryForm } from '../components/EnquiryForm';
import { ProjectDetailModal, PortfolioItem } from '../components/ProjectDetailModal';
import { CtaMotionGraphic } from '../components/CtaMotionGraphic';
import { HeroShowcaseCarousel } from '../components/HeroShowcaseCarousel';
import { HomepageCursorAnimation } from '../components/HomepageCursorAnimation';
import { FocusCardGroup, FocusCardItem } from '../components/FocusCardGroup';
import { ProcessTimeline } from '../components/ProcessTimeline';
import { DynamicCustomSections } from '../components/DynamicCustomSections';
import { useSiteContent } from '../context/SiteContentContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenLetsTalk: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenLetsTalk }) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const { siteContent, trustedBrands, testimonials, customSections } = useSiteContent();

  // CTA Section Convergence and Button Pop Attention States
  const [ctaTriggered, setCtaTriggered] = useState(false);
  const [ctaButtonPopped, setCtaButtonPopped] = useState(false);
  const ctaSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !ctaTriggered) {
            setCtaTriggered(true);
            setTimeout(() => {
              setCtaButtonPopped(true);
              setTimeout(() => {
                setCtaButtonPopped(false);
              }, 950);
            }, 1350);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ctaSectionRef.current) {
      observer.observe(ctaSectionRef.current);
    }

    return () => observer.disconnect();
  }, [ctaTriggered]);

  const brandsToDisplay = trustedBrands && trustedBrands.length > 0
    ? trustedBrands.filter(b => b.active)
    : [
        { id: '1', name: 'Zenith Organics', logoUrl: '' },
        { id: '2', name: 'Kaveri Botanicals', logoUrl: '' },
        { id: '3', name: 'Kaviar Cold Brew', logoUrl: '' },
        { id: '4', name: 'Lumina Audio', logoUrl: '' },
        { id: '5', name: 'Roast Republic', logoUrl: '' },
        { id: '6', name: 'Aura Apparel', logoUrl: '' }
      ];

  const fallbackImage = 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="pt-24 pb-0 overflow-hidden relative">
      {/* HOMEPAGE-ONLY SUBTLE MINIMAL CURSOR ANIMATION (Only on whitespace) */}
      <HomepageCursorAnimation />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER — EXISTING FIVE HERO IMAGES WITH THEIR CURRENT ANIMATION    */}
      {/* ========================================================================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 pb-10 lg:pt-8 lg:pb-14">
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#EEF2F9]/70 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-[#F07822]/10 blur-2xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF2F9] text-[#173B75] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#F07822]" />
              Creative Advertising · Branding · Digital Marketing
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#173B75] tracking-tight leading-[1.12]">
              {siteContent.heroHeadline || 'Good Ideas Deserve Good Folks.'}
            </h1>

            <p className="text-base sm:text-lg text-[#242832]/85 max-w-2xl leading-relaxed">
              {siteContent.heroSubheadline || 'We combine strategy, creative design, branding, and digital marketing to help businesses stand out, connect with the right audience, and grow.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenLetsTalk}
                className="bg-[#F07822] hover:bg-[#d65805] text-white px-7 py-3.5 rounded-full text-base font-semibold shadow-lg shadow-[#F07822]/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>Let's Talk</span>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </button>

              <button
                onClick={() => onNavigate('/portfolio')}
                className="bg-white hover:bg-[#F7F7F5] text-[#173B75] border border-[#E6E8ED] hover:border-[#173B75]/30 px-7 py-3.5 rounded-full text-base font-semibold transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Our Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 text-[#F07822] transition-transform" />
              </button>
            </div>

            {/* Micro proof indicators */}
            <div className="pt-4 border-t border-[#E6E8ED] flex flex-wrap items-center gap-6 text-xs text-[#242832]/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F07822]" />
                <span>Multi-Discipline Creative Studio</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F07822]" />
                <span>Direct Partner Collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F07822]" />
                <span>Transparent UPI Payment Terms</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Five Hero Images with Current Cycling Animation */}
          <div className="lg:col-span-5 relative">
            <HeroShowcaseCarousel onNavigate={onNavigate} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR SERVICES                                                           */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E6E8ED]">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F9] text-[#173B75] text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
            What We Do
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B75] tracking-tight">
            Our Services
          </h2>
          <p className="mt-2 text-base text-[#242832]/80">
            Creative solutions designed to build brands, capture attention, and support business growth.
          </p>
        </div>

        {/* 5 Premium Service Cards with Focus & Blur Interaction */}
        <FocusCardGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES_DATA.map((service, idx) => (
            <FocusCardItem key={service.id} index={idx} className="h-full">
              <div
                onClick={() => onNavigate(`/services#${service.id}`)}
                className="group bg-white rounded-3xl border border-[#E6E8ED] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full"
              >
                <div className="relative h-48 sm:h-52 overflow-hidden bg-[#EEF2F9]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-[#173B75]">
                    {service.number}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#173B75] group-hover:text-[#F07822] transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#242832]/75 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E6E8ED] flex items-center justify-between text-xs font-semibold text-[#173B75] group-hover:text-[#F07822]">
                    <span>Explore Deliverables</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </FocusCardItem>
          ))}

          {/* Consultation Highlight Card */}
          <FocusCardItem index={SERVICES_DATA.length} className="h-full">
            <div className="bg-[#173B75] rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden h-full">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F07822]/20 blur-2xl pointer-events-none" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F07822]">
                  Tailored Engagements
                </span>
                <h3 className="text-2xl font-bold mt-2">Need a custom creative combination?</h3>
                <p className="mt-3 text-sm text-white/80 leading-relaxed">
                  We bundle visual identity, packaging dielines, and performance ad creative into seamless single-partner retainer or milestone workflows.
                </p>
              </div>
              <div className="pt-8">
                <button
                  onClick={onOpenLetsTalk}
                  className="w-full bg-[#F07822] hover:bg-[#d65805] text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Discuss Scope</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </FocusCardItem>
        </FocusCardGroup>

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('/services')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#173B75] hover:text-[#F07822] transition-colors cursor-pointer"
          >
            <span>Explore All 5 Service Suites & FAQs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY GOOD FOLK                                                          */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E6E8ED]">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F9] text-[#173B75] text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
            Core Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B75] tracking-tight">
            Why Good Folk?
          </h2>
          <p className="mt-2 text-base text-[#242832]/80">
            More than creative work. We build ideas that move businesses forward.
          </p>
        </div>

        <FocusCardGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Strength 1 */}
          <FocusCardItem index={0} className="h-full">
            <div className="bg-[#F7F7F5] rounded-3xl p-7 sm:p-8 border border-[#E6E8ED] hover:border-[#173B75]/30 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#173B75] text-white flex items-center justify-center mb-6 shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#173B75]">
                  Creative That Stands Out
                </h3>
                <p className="mt-3 text-sm text-[#242832]/80 leading-relaxed">
                  Designs that capture attention. In a saturated market, generic creative gets overlooked. We design distinctive visual systems and packaging that stop thumbs and earn shelf space.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6E8ED] text-xs font-mono text-[#F07822]">
                01 · Standout Design
              </div>
            </div>
          </FocusCardItem>

          {/* Strength 2 */}
          <FocusCardItem index={1} className="h-full">
            <div className="bg-[#F7F7F5] rounded-3xl p-7 sm:p-8 border border-[#E6E8ED] hover:border-[#173B75]/30 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#173B75] text-white flex items-center justify-center mb-6 shadow-md">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#173B75]">
                  Strategy With Purpose
                </h3>
                <p className="mt-3 text-sm text-[#242832]/80 leading-relaxed">
                  Every idea has a clear goal. Aesthetics without commercial purpose are decorative. Every font choice, color ratio, and video hook is rooted in your business and audience objectives.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6E8ED] text-xs font-mono text-[#F07822]">
                02 · Strategic Focus
              </div>
            </div>
          </FocusCardItem>

          {/* Strength 3 */}
          <FocusCardItem index={2} className="h-full">
            <div className="bg-[#F7F7F5] rounded-3xl p-7 sm:p-8 border border-[#E6E8ED] hover:border-[#173B75]/30 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#173B75] text-white flex items-center justify-center mb-6 shadow-md">
                  <Users2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#173B75]">
                  One Creative Partner
                </h3>
                <p className="mt-3 text-sm text-[#242832]/80 leading-relaxed">
                  Multiple creative services under one roof. No juggling five disconnected freelancers. Brand identity, packaging, e-commerce, video, and social campaigns remain tightly cohesive.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6E8ED] text-xs font-mono text-[#F07822]">
                03 · Single Studio Source
              </div>
            </div>
          </FocusCardItem>
        </FocusCardGroup>
      </section>

      {/* ========================================================================= */}
      {/* 4. WORKFLOW METHODOLOGY — FROM BRIEF TO DELIVERY                          */}
      {/* ========================================================================= */}
      <section className="bg-white border-t border-[#E6E8ED]">
        <ProcessTimeline steps={siteContent.processSteps} onOpenLetsTalk={onOpenLetsTalk} />
      </section>

      {/* ========================================================================= */}
      {/* 5. OUR CLIENTS WITH ITS EXISTING ANIMATION (TRUSTED BY MARQUEE)           */}
      {/* ========================================================================= */}
      <section className="bg-[#F7F7F5] py-8 border-y border-[#E6E8ED] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-5">
          <h2 className="text-xs font-bold text-[#173B75] tracking-widest uppercase mb-1">
            TRUSTED BY
          </h2>
          <p className="text-xs sm:text-sm text-[#242832]/70">
            Brands that trust us to bring their vision to life.
          </p>
        </div>

        {/* Continuous Seamless Horizontal Marquee */}
        <div className="relative w-full overflow-hidden marquee-pause">
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#F7F7F5] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#F7F7F5] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-infinite flex items-center gap-6 py-2">
            {[...brandsToDisplay, ...brandsToDisplay].map((brand, idx) => (
              <div
                key={`${brand.id}-${idx}`}
                className="h-16 min-w-[200px] sm:min-w-[240px] px-6 rounded-2xl border border-[#E6E8ED] bg-white shadow-xs hover:border-[#173B75]/40 hover:shadow-md transition-all flex items-center justify-center shrink-0 cursor-default"
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-8 max-w-[140px] object-contain opacity-75 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-xs sm:text-sm font-bold text-[#173B75]/70 tracking-wider">
                    {brand.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CLIENT TESTIMONIALS                                                    */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F9] text-[#173B75] text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
            Client Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B75] tracking-tight">
            What Our Clients Say
          </h2>
          <p className="mt-2 text-base text-[#242832]/80">
            Building lasting partnerships through creativity, collaboration, and results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials && testimonials.length > 0 ? (
            testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-[#F7F7F5] rounded-3xl p-6 sm:p-7 border border-[#E6E8ED] hover:border-[#173B75]/30 transition-all text-left flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#F07822]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < test.rating ? 'fill-[#F07822] text-[#F07822]' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#242832]/85 leading-relaxed italic mb-6">
                    "{test.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6E8ED] flex items-center gap-3">
                  {test.photoUrl ? (
                    <img
                      src={test.photoUrl}
                      alt={test.clientName}
                      className="w-10 h-10 rounded-full object-cover border border-[#E6E8ED]"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#173B75]/10 text-[#173B75] flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4 text-[#F07822]" />
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-[#173B75]">{test.clientName}</h4>
                    <p className="text-[11px] text-[#242832]/70 font-medium">
                      {test.designation ? `${test.designation}, ` : ''}{test.company}
                    </p>
                    {test.category && (
                      <span className="text-[10px] text-[#F07822] font-semibold block mt-0.5">
                        {test.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-xs text-[#242832]/60 italic">
              Client testimonials are published with explicit client authorization upon milestone completion.
            </div>
          )}
        </div>
      </section>

      {/* DYNAMIC CMS CUSTOM SECTIONS (Excluding standards, which moved to About Us) */}
      {customSections && customSections.length > 0 && (
        <DynamicCustomSections
          sections={customSections.filter(s => (s.page === 'home' || s.page === 'global') && s.id !== 'sec-standards')}
          onNavigate={onNavigate}
          onOpenLetsTalk={onOpenLetsTalk}
        />
      )}

      {/* FINAL CTA BANNER */}
      <section
        ref={ctaSectionRef}
        className="bg-[#173B75] text-white py-16 sm:py-20 relative overflow-hidden"
      >
        <CtaMotionGraphic isTriggered={ctaTriggered} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F07822]">
            Start Your Next Chapter
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {siteContent.ctaHeadline || 'Ready to Build Something Great?'}
          </h2>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            {siteContent.ctaSubheadline || "Have a project in mind? Let's turn your ideas into impactful creative work."}
          </p>

          <div className="pt-3 relative flex justify-center items-center">
            <div
              className={`absolute w-44 h-16 rounded-full bg-white/20 blur-md transition-all duration-700 pointer-events-none ${
                ctaButtonPopped ? 'opacity-100 scale-125' : 'opacity-0 scale-75'
              }`}
            />
            <button
              onClick={onOpenLetsTalk}
              className={`bg-[#F07822] hover:bg-[#d65805] text-white px-9 py-4 rounded-full text-base font-bold shadow-xl shadow-[#F07822]/30 hover:scale-105 active:scale-95 transition-all duration-500 inline-flex items-center gap-2.5 cursor-pointer relative z-20 ${
                ctaButtonPopped
                  ? 'scale-110 ring-4 ring-white shadow-2xl'
                  : 'scale-100 ring-0'
              }`}
            >
              <span>Let's Talk</span>
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT PREVIEW & REAL ENQUIRY FORM */}
      <section className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F9] text-[#173B75] text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
                Get In Touch
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B75] tracking-tight">
                Let's Start a Conversation
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#242832]/80 leading-relaxed">
                Tell us about your project. We'd love to hear what you have in mind. We review every brief personally and respond with concrete recommendations.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E6E8ED] flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#173B75] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#F07822]" />
                </div>
                <div>
                  <div className="text-xs text-[#242832]/60 font-medium">Direct Email</div>
                  <a
                    href={`mailto:${siteContent.contactEmail || 'akshay@goodfolksolution.in'}`}
                    className="text-sm font-semibold text-[#173B75] hover:text-[#F07822] transition-colors"
                  >
                    {siteContent.contactEmail || 'akshay@goodfolksolution.in'}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E6E8ED] flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#252A34]/60 font-medium">WhatsApp Direct Line</div>
                  <a
                    href={`https://wa.me/${(siteContent.functionalPhoneDestination || siteContent.contactWhatsapp || '919817961412').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#173B75] hover:text-[#F07822] transition-colors font-mono tracking-wide"
                  >
                    {siteContent.contactPhone || '0000000'}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/contact')}
                className="text-xs font-bold text-[#173B75] hover:text-[#F07822] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Looking for the comprehensive project enquiry form?</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Real Enquiry Form */}
          <div className="lg:col-span-7">
            <EnquiryForm isFullContactPage={false} />
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
