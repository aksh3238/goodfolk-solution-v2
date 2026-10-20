import React from 'react';
import { Logo } from './Logo';
import { ExternalLink, Mail, Phone, Lock } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenLetsTalk: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLetsTalk }) => {
  const { siteContent } = useSiteContent();

  const functionalWaUrl = `https://wa.me/${(siteContent.functionalPhoneDestination || siteContent.contactWhatsapp || '919817961412').replace(/[^0-9]/g, '')}`;

  return (
    <footer className="bg-[#173B75] text-white pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Subtle background abstract shapes */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#F07822]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/15">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('/')}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F07822] rounded-lg p-1 -m-1 cursor-pointer"
            >
              <Logo
                variant="white"
                size="lg"
                customLogoUrl={siteContent.logoUrl}
                logoText={siteContent.logoText}
                logoSubtitle={siteContent.logoSubtitle}
              />
            </button>
            <p className="text-white/80 text-sm max-w-sm leading-relaxed font-normal">
              We build brands that move businesses forward. Combining strategy, creative design, branding, and digital marketing to help ambitious businesses stand out and grow.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F07822]" />
                <a href={`mailto:${siteContent.contactEmail || 'akshay@goodfolksolution.in'}`} className="hover:text-white transition-colors">
                  {siteContent.contactEmail || 'akshay@goodfolksolution.in'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F07822]" />
                <a
                  href={functionalWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-mono tracking-wide"
                >
                  {siteContent.contactPhone || '0000000'} (WhatsApp Available)
                </a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-bold text-[#F07822] tracking-wider uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/portfolio')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Our Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLetsTalk}
                  className="text-[#F07822] font-semibold hover:underline flex items-center gap-1"
                >
                  Let's Talk &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold text-[#F07822] tracking-wider uppercase mb-4">
              All 10 Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/services#branding')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  01. Branding & Packaging
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services#creative')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  02. Creative Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services#performance')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  03. Performance Marketing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services#video')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  04. Video Production & Editing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services#digital')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  05. Digital Marketing & Social
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services#uiux')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  06. Website & UI/UX Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services#ecommerce')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  07. E-commerce Creative
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services#motion')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  08. Motion Graphics & Animation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services#print')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  09. Print & Collateral
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services#presentation')}
                  className="text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  10. Presentation & Pitch Decks
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Legal */}
          <div>
            <h3 className="text-xs font-bold text-[#F07822] tracking-wider uppercase mb-4">
              Connect
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/goodfolksolution/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Instagram <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteContent.contactEmail || 'akshay@goodfolksolution.in'}`}
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Email <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={functionalWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  WhatsApp <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>

            <h3 className="text-xs font-bold text-[#F07822] tracking-wider uppercase mt-6 mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © 2026 Good Folk Solution. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-white/40">
              Direct UPI: 9817961412@ibl
            </span>
            {/* Subtle link to Admin console for authorized agency owner */}
            <button
              onClick={() => onNavigate('/admin')}
              className="text-white/40 hover:text-[#F07822] flex items-center gap-1 transition-colors cursor-pointer"
              title="Secure Admin Console"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Console</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
