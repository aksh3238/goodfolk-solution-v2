import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  Clock,
  QrCode
} from 'lucide-react';
import type { CMSProcessStep } from '../types';

interface ProcessTimelineProps {
  steps?: CMSProcessStep[];
  onOpenLetsTalk?: () => void;
}

const DEFAULT_STEPS: CMSProcessStep[] = [
  {
    id: 'step-1',
    number: '01',
    title: 'Brief',
    subtitle: 'Strategic Discovery & Scope',
    desc: 'We clarify the commercial problem, brand vision, target demographic, and exact deliverables before any design work begins.',
    iconName: 'Compass',
    badge: 'Strategic Alignment'
  },
  {
    id: 'step-2',
    number: '02',
    title: 'Create',
    subtitle: 'Design Sprints & Visual Craft',
    desc: 'Translating strategic insights into tangible packaging dielines, brand identities, digital storefronts, and conversion creative.',
    iconName: 'Sparkles',
    badge: 'Design Craft'
  },
  {
    id: 'step-3',
    number: '03',
    title: 'Review & Approve',
    subtitle: 'Collaborative Iteration',
    desc: 'Direct founder feedback rounds, meticulous kerning and print calibration, ensuring every asset meets exacting standards.',
    iconName: 'CheckCircle',
    badge: 'Review & Refinement'
  },
  {
    id: 'step-4',
    number: '04',
    title: 'Deliver & Pay',
    subtitle: 'Master Assets & Direct UPI',
    desc: 'Production-ready vector master files handed over with transparent UPI payment terms (Manual verification upon UTR submission).',
    iconName: 'ShieldCheck',
    badge: 'Final Delivery'
  }
];

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps, onOpenLetsTalk }) => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [inView, setInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const displaySteps = steps && steps.length > 0 ? steps : DEFAULT_STEPS;

  // Reduced motion preference check
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
    }
  }, []);

  // Intersection observer to activate when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            setInView(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Continuous Seamless Looping Animation: 0 -> 1 -> 2 -> 3 -> 0 smoothly
  useEffect(() => {
    if (!inView || isPaused || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Advance to next stage every 2600ms continuously
    timerRef.current = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % displaySteps.length);
    }, 2600);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inView, isPaused, prefersReducedMotion, displaySteps.length]);

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'CheckCircle':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-white" />;
      default:
        return <Compass className="w-5 h-5 text-white" />;
    }
  };

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2F9] text-[#173B75] text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F07822]" />
            From Brief to Delivery
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#173B75] tracking-tight">
            Our Working Methodology
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#252A34]/80 leading-relaxed">
            A structured four-stage process engineered for speed, transparent communication, and commercial results.
          </p>
        </div>

        {/* Process Flow Journey (Desktop Horizontal / Mobile Vertical) */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Desktop Connecting Trail Line (Behind cards) */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-1 bg-[#E6E8ED] -z-0">
            <div
              className="h-full bg-gradient-to-r from-[#173B75] via-[#2458A6] to-[#F07822] transition-all duration-700 ease-in-out shadow-sm rounded-full"
              style={{
                width: `${((activeStage + 1) / displaySteps.length) * 100}%`
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
            {displaySteps.map((step, idx) => {
              const isActive = idx === activeStage;
              const isPast = idx <= activeStage;
              const isFinalStep = idx === displaySteps.length - 1;

              return (
                <div
                  key={step.id || idx}
                  onClick={() => setActiveStage(idx)}
                  className="flex flex-col relative group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Top Connector Circle & Number */}
                  <div className="flex items-center lg:flex-col lg:items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-500 shadow-md ${
                        isActive
                          ? 'bg-[#173B75] text-white ring-4 ring-[#F07822]/40 scale-110 shadow-lg shadow-[#173B75]/20'
                          : isPast
                          ? 'bg-[#2458A6] text-white scale-100'
                          : 'bg-[#F7F7F5] text-[#173B75]/50 border border-[#E6E8ED]'
                      }`}
                    >
                      {renderIcon(step.iconName)}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded transition-colors ${
                          isActive
                            ? 'bg-[#F07822] text-white'
                            : 'text-[#F07822] bg-[#F07822]/10'
                        }`}
                      >
                        {step.number}
                      </span>
                      {step.badge && (
                        <span className="text-[11px] font-semibold text-[#252A34]/60 hidden sm:inline-block">
                          {step.badge}
                        </span>
                      )}
                    </div>

                    {/* Mobile Down Arrow between steps */}
                    {idx < displaySteps.length - 1 && (
                      <div className="lg:hidden ml-auto text-[#F07822]">
                        <ArrowDown className="w-4 h-4 animate-bounce" />
                      </div>
                    )}
                  </div>

                  {/* Stage Card */}
                  <div
                    className={`p-6 rounded-3xl border transition-all duration-500 flex-1 flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#FFF9F1] border-[#F07822] ring-2 ring-[#F07822]/20 shadow-xl'
                        : isPast
                        ? 'bg-[#F7F7F5] border-[#173B75]/20 shadow-xs'
                        : 'bg-white border-[#E6E8ED] opacity-80'
                    }`}
                  >
                    <div>
                      <h3
                        className={`text-xl font-bold transition-colors ${
                          isActive ? 'text-[#173B75]' : 'text-[#173B75] group-hover:text-[#F07822]'
                        }`}
                      >
                        {step.title}
                      </h3>
                      {step.subtitle && (
                        <div className="text-xs font-semibold text-[#F07822] mt-0.5">
                          {step.subtitle}
                        </div>
                      )}
                      <p className="mt-3 text-xs sm:text-sm text-[#252A34]/85 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {/* Special Final Step Highlight: Direct UPI Details with Transparency */}
                    {isFinalStep && (
                      <div className="mt-4 pt-3 border-t border-[#E6E8ED] bg-white/90 p-3 rounded-2xl border">
                        <div className="flex items-center justify-between text-[11px] text-[#173B75] font-bold">
                          <span className="flex items-center gap-1.5">
                            <QrCode className="w-3.5 h-3.5 text-[#F07822]" />
                            <span>Direct UPI Settlement</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                            Zero Surcharges
                          </span>
                        </div>
                        <div className="mt-1 font-mono text-[11px] font-semibold text-[#173B75] bg-[#EEF2F9] px-2 py-1 rounded select-all">
                          akshay@goodfolksolution.in / 9817961412@ibl
                        </div>
                        <div className="text-[10px] text-[#252A34]/60 mt-1 italic">
                          Manual verification upon UTR submission.
                        </div>
                      </div>
                    )}

                    {/* Progress indicator bottom bar */}
                    <div className="mt-4 pt-3 border-t border-[#E6E8ED]/80 flex items-center justify-between text-xs text-[#252A34]/60">
                      <span className="text-[11px] font-medium">Stage {idx + 1} of {displaySteps.length}</span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          isActive
                            ? 'bg-[#F07822] ring-4 ring-[#F07822]/30 scale-125'
                            : isPast
                            ? 'bg-[#173B75]'
                            : 'bg-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Desktop Directional Arrow between cards */}
                  {idx < displaySteps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3.5 top-[86px] w-7 h-7 rounded-full bg-white border border-[#E6E8ED] shadow-sm items-center justify-center text-[#F07822] z-20">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Assurance Callout */}
        <div className="mt-12 bg-[#EEF2F9]/70 rounded-3xl p-6 sm:p-8 border border-[#173B75]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#173B75] text-white flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-6 h-6 text-[#F07822]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#173B75]">
                Clear Timelines & No Hidden Overhead
              </h4>
              <p className="text-xs sm:text-sm text-[#252A34]/75">
                Every project begins with agreed milestones, delivery dates, and direct contact with senior creative leads.
              </p>
            </div>
          </div>

          {onOpenLetsTalk && (
            <button
              onClick={onOpenLetsTalk}
              className="bg-[#173B75] hover:bg-[#112d5a] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md flex items-center gap-2 hover:shadow-lg"
            >
              <span>Discuss Your Scope</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F07822]" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
