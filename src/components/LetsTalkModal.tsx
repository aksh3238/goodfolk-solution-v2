import React, { useEffect } from 'react';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface LetsTalkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LetsTalkModal: React.FC<LetsTalkModalProps> = ({ isOpen, onClose }) => {
  const { siteContent } = useSiteContent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const functionalWaNumber = (siteContent.functionalPhoneDestination || siteContent.contactWhatsapp || '919817961412').replace(/[^0-9]/g, '');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#173B75]/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-6 sm:p-8 z-10 transition-all duration-300 transform scale-100 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#E8EFF8] text-[#173B75] hover:bg-[#F07822] hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F07822]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#E8EFF8] text-[#173B75] text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F07822] animate-pulse" />
            DIRECT AGENCY CHANNELS
          </div>
          <h2 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-[#173B75] tracking-tight">
            Let's Talk!
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#252A34]/80">
            How would you like to connect with us?
          </p>
        </div>

        {/* 3 Authentic Options */}
        <div className="space-y-3.5">
          {/* 1. WhatsApp */}
          <a
            href={`https://wa.me/${functionalWaNumber}?text=Hi%20Good%20Folk%20Solution%2C%20I%27d%20like%20to%20discuss%20a%20project.`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-xl border border-[#E6E8ED] bg-[#FFF9F1] hover:bg-[#E8EFF8] hover:border-[#25D366]/40 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:outline-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[#173B75] group-hover:text-[#F07822] transition-colors flex items-center gap-1.5">
                  WhatsApp
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-xs text-[#252A34]/70 font-mono mt-0.5 tracking-wide">
                  {siteContent.contactPhone || '0000000'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#173B75] group-hover:translate-x-1 group-hover:text-[#F07822] transition-all" />
          </a>

          {/* 2. Instagram */}
          <a
            href={siteContent.contactInstagram || 'https://www.instagram.com/goodfolksolution/'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-xl border border-[#E6E8ED] bg-[#FFF9F1] hover:bg-[#E8EFF8] hover:border-[#E1306C]/40 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E1306C] focus-visible:outline-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[#173B75] group-hover:text-[#F07822] transition-colors flex items-center gap-1.5">
                  Instagram
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-xs text-[#252A34]/70 mt-0.5">
                  {siteContent.contactInstagram?.replace('https://www.instagram.com/', '@').replace(/\/$/, '') || '@goodfolksolution'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#173B75] group-hover:translate-x-1 group-hover:text-[#F07822] transition-all" />
          </a>

          {/* 3. Email */}
          <a
            href={`mailto:${siteContent.contactEmail || 'akshay@goodfolksolution.in'}`}
            className="group flex items-center justify-between p-4 rounded-xl border border-[#E6E8ED] bg-[#FFF9F1] hover:bg-[#E8EFF8] hover:border-[#173B75]/40 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#173B75] focus-visible:outline-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#173B75]/10 text-[#173B75] flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-.42l4.616-3.741v9.346l-4.616-5.605z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[#173B75] group-hover:text-[#F07822] transition-colors flex items-center gap-1.5">
                  Email Us
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-xs text-[#252A34]/70 font-mono mt-0.5">
                  {siteContent.contactEmail || 'akshay@goodfolksolution.in'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#173B75] group-hover:translate-x-1 group-hover:text-[#F07822] transition-all" />
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E6E8ED] text-center">
          <p className="text-xs text-[#252A34]/60">
            Based in India · Serving Ambitious Brands Worldwide
          </p>
        </div>
      </div>
    </div>
  );
};
