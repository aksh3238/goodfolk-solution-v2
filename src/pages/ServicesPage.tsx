import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/services';
import { Check, ChevronDown, ArrowRight, Sparkles, Layers, Eye } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { FocusCardGroup, FocusCardItem } from '../components/FocusCardGroup';
import { CtaMotionGraphic } from '../components/CtaMotionGraphic';
import { ServicesCreativeBanner } from '../components/ServicesCreativeBanner';
import type { CMSServiceConcept } from '../types';

interface ServicesPageProps {
  onOpenLetsTalk: () => void;
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenLetsTalk, onNavigate }) => {
  const { serviceConcepts, customSections } = useSiteContent();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Expandable concepts view per service
  const [expandedConcepts, setExpandedConcepts] = useState<Record<string, boolean>>({
    branding: true,
    creative: false,
    performance: false,
    video: false,
    digital: false
  });
  const [selectedConcept, setSelectedConcept] = useState<CMSServiceConcept | null>(null);

  const toggleConcepts = (serviceId: string) => {
    setExpandedConcepts(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const faqs = [
    {
      q: 'What services does Goodfolk Solution offer?',
      a: 'We specialize in five core creative disciplines: (1) Branding & Packaging, (2) Creative Design including Amazon A+ and website collateral, (3) Performance Marketing Creatives for Meta and Google Ads, (4) Video Production & Editing for commercials and short-form reels, and (5) Digital Marketing & Social Media Management.'
    },
    {
      q: 'Can I hire Goodfolk for a single project?',
      a: 'Yes, absolutely. We work on both single high-impact milestone projects (e.g. creating brand identity dielines for a new product launch or a holiday ad creative sprint) as well as ongoing multi-service monthly creative retainers.'
    },
    {
      q: 'Do you work with businesses outside India?',
      a: 'Yes. We are based in India and serve ambitious clients worldwide across the UAE, United States, United Kingdom, Singapore, and Australia, managing timezone coordination and deliverables seamlessly.'
    },
    {
      q: 'How do project timelines work?',
      a: 'Timelines depend strictly on project scope and deliverables. A standalone visual identity or packaging project typically takes 2 to 4 weeks, while performance ad batches are often delivered in 7 to 14 days. We establish a firm deadline in your quotation before kickoff.'
    },
    {
      q: 'How are quotations and payments handled?',
      a: 'Following your brief, we provide a transparent, itemized quotation. Payments are conducted via direct UPI to our official ID 9817961412@ibl in standard milestones (typically 50% advance before kickoff and 50% upon final artwork approval). Official verified receipts are generated upon bank verification.'
    },
    {
      q: 'Can you provide multiple creative services for one brand?',
      a: 'Yes! That is one of our greatest strengths. Having branding, packaging, video, e-commerce, and advertising under one roof ensures brand consistency, eliminates miscommunication, and saves you the overhead of coordinating multiple disparate agencies.'
    }
  ];

  return (
    <div className="pt-24 pb-0 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F9] text-[#173B75] text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
          Comprehensive Creative Capabilities
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#173B75] tracking-tight max-w-4xl mx-auto leading-tight">
          Creative Solutions for Ambitious Brands.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#242832]/80 max-w-2xl mx-auto leading-relaxed">
          From brand identity to digital campaigns, we create thoughtful creative solutions that help businesses stand out and grow.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {SERVICES_DATA.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-4 py-2 rounded-full border border-[#E6E8ED] bg-white text-xs font-semibold text-[#173B75] hover:border-[#F07822] hover:text-[#F07822] transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>
      </section>

      {/* EDITABLE ADVERTISING-AGENCY CREATIVE BANNER */}
      <ServicesCreativeBanner onOpenLetsTalk={onOpenLetsTalk} onNavigate={onNavigate} />

      {/* CREATIVE CAPABILITIES OVERVIEW (Moved from About Us) */}
      <section className="bg-[#F7F7F5] py-14 lg:py-16 border-y border-[#E6E8ED] mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
              Creative Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B75] mt-1 tracking-tight">
              What We Do
            </h2>
            <p className="text-sm sm:text-base text-[#242832]/75 mt-2">
              Five specialized services coordinated by a single dedicated creative team.
            </p>
          </div>

          {/* 5 Specialized Services Grid with Focus Interaction */}
          <FocusCardGroup className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SERVICES_DATA.map((s, idx) => (
              <FocusCardItem key={s.id} index={idx} className="h-full">
                <a
                  href={`#${s.id}`}
                  className="w-full text-left bg-white p-5 rounded-2xl border border-[#E6E8ED] hover:border-[#F07822] shadow-sm transition-all group flex flex-col justify-between cursor-pointer h-full"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-[#F07822]">{s.number}</span>
                    <h3 className="text-sm font-bold text-[#173B75] group-hover:text-[#F07822] mt-1 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[#242832]/70 mt-2 line-clamp-2">
                      {s.shortDesc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E6E8ED] flex items-center justify-between text-xs font-semibold text-[#173B75]">
                    <span>Explore Scope</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-[#F07822] transition-transform" />
                  </div>
                </a>
              </FocusCardItem>
            ))}
          </FocusCardGroup>
        </div>
      </section>

      {/* 5 In-Depth Service Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-28">
        {SERVICES_DATA.map((service, idx) => {
          const isEven = idx % 2 === 1;
          const isConceptsOpen = Boolean(expandedConcepts[service.id]);
          // Filter concepts specific to this service
          const relevantConcepts = (serviceConcepts || []).filter(
            c => c.serviceId.toLowerCase() === service.id.toLowerCase() && c.published
          );
          // Filter custom sections assigned to this service
          const serviceCustomSections = (customSections || []).filter(
            s => s.serviceSlug === service.slug && s.published
          );

          return (
            <section
              key={service.id}
              id={service.id}
              className="scroll-mt-28 border-t border-[#E6E8ED] pt-16 lg:pt-24 space-y-12"
            >
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                {/* Visual */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E6E8ED] bg-white group">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-80 sm:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#173B75] shadow-sm">
                      {service.number} · {service.title}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-1' : ''}`}>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#F07822] uppercase tracking-wider font-mono">
                      Service Discipline {service.number}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B75] tracking-tight">
                      {service.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#242832]/85 leading-relaxed pt-2">
                      {service.fullDesc}
                    </p>
                  </div>

                  {/* Deliverables List with Focus & Blur */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
                      Scope & Deliverables
                    </h3>
                    <FocusCardGroup className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.deliverables.map((item, dIdx) => (
                        <FocusCardItem key={dIdx} index={dIdx}>
                          <div className="flex items-start gap-2 text-xs text-[#242832]/85 bg-[#F7F7F5] p-2.5 rounded-xl border border-[#E6E8ED] h-full">
                            <Check className="w-4 h-4 text-[#F07822] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        </FocusCardItem>
                      ))}
                    </FocusCardGroup>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1 text-xs text-[#242832]/70">
                    {service.keyHighlights.map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#173B75]" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <button
                      onClick={onOpenLetsTalk}
                      className="bg-[#F07822] hover:bg-[#d65805] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                    >
                      <span>Discuss Your Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Functional View Relevant Concepts Link */}
                    <button
                      onClick={() => toggleConcepts(service.id)}
                      className="px-4 py-2.5 rounded-full border border-[#173B75]/20 bg-white hover:bg-[#EEF2F9] text-xs font-bold text-[#173B75] hover:text-[#F07822] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      aria-expanded={isConceptsOpen}
                    >
                      <Eye className="w-3.5 h-3.5 text-[#F07822]" />
                      <span>{isConceptsOpen ? 'Hide Relevant Concepts' : `View Relevant Concepts (${relevantConcepts.length})`}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isConceptsOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Functional Service-Specific Concepts Showcase (Expandable / Inline) */}
              {isConceptsOpen && (
                <div className="bg-[#F7F7F5] rounded-3xl p-6 sm:p-10 border border-[#E6E8ED] space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E8ED] pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173B75]/10 text-[#173B75] text-[11px] font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3 text-[#F07822]" />
                        {service.title} Concepts
                      </div>
                      <h3 className="text-xl font-bold text-[#173B75]">
                        Curated Concepts & Creative Case Studies
                      </h3>
                      <p className="text-xs text-[#242832]/70 mt-1">
                        Real-world executions, tactile packaging specs, and commercial deliverables for this discipline.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('/portfolio')}
                      className="text-xs font-bold text-[#F07822] hover:text-[#173B75] transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      View Full Agency Portfolio &rarr;
                    </button>
                  </div>

                  {relevantConcepts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#242832]/60">
                      No concepts currently published for this discipline. New concepts can be added in the Admin Console.
                    </div>
                  ) : (
                    <FocusCardGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {relevantConcepts.map((concept, cIdx) => (
                        <FocusCardItem key={concept.id} index={cIdx} className="h-full">
                          <div
                            onClick={() => setSelectedConcept(concept)}
                            className="bg-white rounded-2xl border border-[#E6E8ED] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full cursor-pointer group"
                          >
                            <div className="relative h-56 overflow-hidden bg-[#EEF2F9]">
                              <img
                                src={concept.image}
                                alt={concept.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-[#173B75] shadow-xs">
                                {concept.clientName || service.title}
                              </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="text-base font-bold text-[#173B75] group-hover:text-[#F07822] transition-colors">
                                  {concept.title}
                                </h4>
                                <p className="text-xs text-[#242832]/80 mt-1 line-clamp-2">
                                  {concept.tagline || concept.description}
                                </p>

                                {/* Deliverable tags */}
                                {concept.deliverables && concept.deliverables.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {concept.deliverables.slice(0, 3).map((d, dIdx) => (
                                      <span
                                        key={dIdx}
                                        className="text-[10px] font-medium bg-[#EEF2F9] text-[#173B75] px-2 py-0.5 rounded"
                                      >
                                        {d}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="mt-4 pt-3 border-t border-[#E6E8ED] flex items-center justify-between text-xs font-bold text-[#F07822]">
                                <span>Inspect Concept Deliverables</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </FocusCardItem>
                      ))}
                    </FocusCardGroup>
                  )}
                </div>
              )}

              {/* Service Custom Sections Managed via CMS */}
              {serviceCustomSections.map(sec => (
                <div key={sec.id} className="bg-white rounded-3xl p-8 border border-[#E6E8ED] shadow-sm space-y-6">
                  <div>
                    {sec.badge && (
                      <span className="text-[11px] font-bold text-[#F07822] uppercase tracking-wider bg-[#F07822]/10 px-2.5 py-0.5 rounded mb-2 inline-block">
                        {sec.badge}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-[#173B75]">{sec.title}</h3>
                    {sec.description && (
                      <p className="text-sm text-[#242832]/75 mt-1">{sec.description}</p>
                    )}
                  </div>

                  {sec.cards && sec.cards.length > 0 && (
                    <FocusCardGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sec.cards.map((card, cardIdx) => (
                        <FocusCardItem key={card.id || cardIdx} index={cardIdx} className="h-full">
                          <div className="bg-[#F7F7F5] rounded-2xl p-6 border border-[#E6E8ED] h-full flex flex-col justify-between">
                            <div>
                              {card.badge && (
                                <span className="text-[10px] font-bold text-[#173B75] uppercase mb-1 block">
                                  {card.badge}
                                </span>
                              )}
                              <h4 className="text-base font-bold text-[#173B75]">{card.title}</h4>
                              <p className="text-xs text-[#242832]/75 mt-1">{card.description}</p>
                            </div>
                          </div>
                        </FocusCardItem>
                      ))}
                    </FocusCardGroup>
                  )}
                </div>
              ))}
            </section>
          );
        })}
      </div>

      {/* Concept Detail Modal */}
      {selectedConcept && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedConcept(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#E6E8ED] shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E6E8ED] pb-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#F07822] uppercase">
                  {selectedConcept.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#173B75]">
                  {selectedConcept.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedConcept(null)}
                className="w-8 h-8 rounded-full bg-[#F7F7F5] hover:bg-[#EEF2F9] text-gray-500 hover:text-gray-900 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden mb-6 bg-[#EEF2F9] h-64 sm:h-80">
              <img
                src={selectedConcept.image}
                alt={selectedConcept.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#242832]/85">
              <div>
                <h4 className="font-bold text-[#173B75] uppercase text-xs mb-1">Concept Overview</h4>
                <p className="leading-relaxed">{selectedConcept.description}</p>
              </div>

              {selectedConcept.deliverables && selectedConcept.deliverables.length > 0 && (
                <div>
                  <h4 className="font-bold text-[#173B75] uppercase text-xs mb-2">Deliverables & Specs</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedConcept.deliverables.map((d, dIdx) => (
                      <div key={dIdx} className="bg-[#F7F7F5] p-2.5 rounded-xl border border-[#E6E8ED] flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#F07822]" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E6E8ED] flex justify-end gap-3">
              <button
                onClick={() => setSelectedConcept(null)}
                className="px-5 py-2.5 rounded-full border border-[#E6E8ED] text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedConcept(null);
                  onOpenLetsTalk();
                }}
                className="px-6 py-2.5 rounded-full bg-[#F07822] hover:bg-[#d65805] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Brief Similar Scope
              </button>
            </div>
          </div>
        </div>
      )}

      {/* From Brief to Delivery Process */}
      <section className="bg-[#EEF2F9]/50 py-20 mt-28 border-y border-[#E6E8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B75]">
              From Brief to Delivery
            </h2>
            <p className="text-sm text-[#242832]/80 mt-2">
              Every project follows our verified four-step collaboration cycle.
            </p>
          </div>

          <FocusCardGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FocusCardItem index={0} className="h-full">
              <div className="bg-white p-6 rounded-2xl border border-[#E6E8ED] shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#F07822] mb-2">01 · BRIEF</div>
                  <h3 className="text-base font-bold text-[#173B75]">Understand & Plan</h3>
                  <p className="text-xs text-[#242832]/75 mt-2 leading-relaxed">
                    We deep dive into your business model, competitive landscape, product formulations, and specific goals.
                  </p>
                </div>
              </div>
            </FocusCardItem>
            <FocusCardItem index={1} className="h-full">
              <div className="bg-white p-6 rounded-2xl border border-[#E6E8ED] shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#F07822] mb-2">02 · CREATE</div>
                  <h3 className="text-base font-bold text-[#173B75]">Explore & Design</h3>
                  <p className="text-xs text-[#242832]/75 mt-2 leading-relaxed">
                    Crafting distinct concept directions, packaging dielines, typography, and high-retention video cuts.
                  </p>
                </div>
              </div>
            </FocusCardItem>
            <FocusCardItem index={2} className="h-full">
              <div className="bg-white p-6 rounded-2xl border border-[#E6E8ED] shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#F07822] mb-2">03 · REVIEW</div>
                  <h3 className="text-base font-bold text-[#173B75]">Review & Refine</h3>
                  <p className="text-xs text-[#242832]/75 mt-2 leading-relaxed">
                    Structured feedback cycles to calibrate aesthetic nuances and verify manufacturing compliance.
                  </p>
                </div>
              </div>
            </FocusCardItem>
            <FocusCardItem index={3} className="h-full">
              <div className="bg-white p-6 rounded-2xl border border-[#E6E8ED] shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#F07822] mb-2">04 · DELIVER</div>
                  <h3 className="text-base font-bold text-[#173B75]">Delivery & Receipt</h3>
                  <p className="text-xs text-[#242832]/75 mt-2 leading-relaxed">
                    Production-ready files released upon milestone payment to 9817961412@ibl and verified receipt issued.
                  </p>
                </div>
              </div>
            </FocusCardItem>
          </FocusCardGroup>
        </div>
      </section>

      {/* Services FAQs */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F07822]">
            Clear Answers
          </span>
          <h2 className="text-3xl font-extrabold text-[#173B75] mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#242832]/70 mt-2">
            Everything you need to know about partnering with Goodfolk Solution.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-[#E6E8ED] rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#173B75] hover:text-[#F07822] transition-colors focus-visible:outline-none cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#F07822] transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-sm text-[#242832]/80 leading-relaxed border-t border-[#E6E8ED]/50 bg-[#F7F7F5]/50 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FULL-WIDTH CTA BANNER (Edge-to-Edge across viewport, matching Homepage) */}
      <section className="w-full bg-[#173B75] text-white py-16 sm:py-20 relative overflow-hidden mt-16 sm:mt-24">
        <CtaMotionGraphic className="opacity-80" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F07822]">
            Start Your Next Chapter
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Discuss Your Project Requirements?
          </h2>
          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            Connect directly with our team to explore timelines, deliverables, and customized scope.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenLetsTalk}
              className="bg-[#F07822] hover:bg-[#d65805] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-[#F07822]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Let's Talk</span>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all border border-white/20 hover:border-white/40 cursor-pointer flex items-center gap-2"
            >
              <span>Submit Project Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
