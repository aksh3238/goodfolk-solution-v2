import React, { useEffect } from 'react';
import { X, Check, ArrowRight, Sparkles, Layers, ShieldCheck, Clock, FileText } from 'lucide-react';
import type { ServiceItem } from '../data/services';
import { PORTFOLIO_ITEMS } from '../data/portfolio';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onOpenLetsTalk: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onOpenLetsTalk
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (service) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [service, onClose]);

  if (!service) return null;

  // Filter relevant portfolio items if matching category or keywords
  const relevantPortfolio = PORTFOLIO_ITEMS.slice(0, 3);

  const processStages = [
    { num: '01', title: 'Strategic Discovery', desc: 'Understanding your commercial goals, target demographic, and project scope.' },
    { num: '02', title: 'Creative Concepts', desc: 'Developing distinct design directions and structured variations.' },
    { num: '03', title: 'Review & Refine', desc: 'Iterating on typography, color calibration, and stakeholder feedback.' },
    { num: '04', title: 'Final Delivery', desc: 'Production-ready master files, dielines, and complete asset kits delivered.' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E6E8ED] my-8 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#173B75]">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer z-20 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badge */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-mono font-bold uppercase tracking-wider text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
              Service Discipline {service.number}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {service.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
              {service.shortDesc}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Overview */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
              Overview & Commercial Scope
            </h3>
            <p className="text-sm sm:text-base text-[#242832]/85 leading-relaxed">
              {service.fullDesc}
            </p>
          </div>

          {/* Scope & Deliverables */}
          <div className="space-y-4 pt-4 border-t border-[#E6E8ED]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
              Core Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[#242832]/85 bg-[#F7F7F5] p-3 rounded-xl border border-[#E6E8ED]"
                >
                  <Check className="w-4 h-4 text-[#F07822] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Highlights */}
          {service.keyHighlights && service.keyHighlights.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#E6E8ED]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
                Quality Commitments & Standards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {service.keyHighlights.map((hl, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#EEF2F9] text-xs font-semibold text-[#173B75] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F07822] shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4-Stage Process */}
          <div className="space-y-4 pt-4 border-t border-[#E6E8ED]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
              Execution Methodology
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {processStages.map((stg) => (
                <div key={stg.num} className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E6E8ED] space-y-1">
                  <span className="text-[11px] font-mono font-bold text-[#F07822]">{stg.num}</span>
                  <h4 className="text-xs font-bold text-[#173B75]">{stg.title}</h4>
                  <p className="text-[11px] text-[#242832]/70 leading-relaxed">{stg.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Portfolio Work Preview */}
          <div className="space-y-4 pt-4 border-t border-[#E6E8ED]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B75]">
              Featured Work in this Discipline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relevantPortfolio.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#E6E8ED] overflow-hidden bg-white shadow-xs">
                  <div className="h-28 overflow-hidden bg-slate-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <span className="text-[9px] font-bold text-[#F07822] uppercase tracking-wider">{item.category}</span>
                    <h5 className="text-xs font-bold text-[#173B75] truncate">{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-6 bg-[#F7F7F5] border-t border-[#E6E8ED] flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-[#173B75] hover:bg-white transition-colors cursor-pointer border border-[#E6E8ED]"
          >
            Close Details
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenLetsTalk();
            }}
            className="bg-[#F07822] hover:bg-[#d65805] text-white px-7 py-3 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <span>Discuss {service.title} Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
