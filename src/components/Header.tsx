import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { ChevronDown, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenLetsTalk: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenLetsTalk }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 180);
  };

  const serviceLinks = [
    {
      title: '01. Branding & Packaging',
      desc: 'Brand identity, logo systems, packaging design and brand guidelines.',
      anchor: '/services#branding'
    },
    {
      title: '02. Creative Design',
      desc: 'Social creatives, advertising graphics, website assets and collateral.',
      anchor: '/services#creative'
    },
    {
      title: '03. Performance Marketing',
      desc: 'Paid advertising visuals, campaign creatives and conversion design.',
      anchor: '/services#performance'
    },
    {
      title: '04. Video Production & Editing',
      desc: 'Product videos, promotional videos, reels and motion graphics.',
      anchor: '/services#video'
    },
    {
      title: '05. Digital Marketing & Social',
      desc: 'Social media strategy, content calendars and publishing.',
      anchor: '/services#digital'
    },
    {
      title: '06. Website & UI/UX Design',
      desc: 'Website interfaces, landing pages, user journeys and layouts.',
      anchor: '/services#uiux'
    },
    {
      title: '07. E-commerce Creative',
      desc: 'Amazon A+ content, listing images and storefront graphics.',
      anchor: '/services#ecommerce'
    },
    {
      title: '08. Motion Graphics & Animation',
      desc: 'Animated ads, logo animations and kinetic typography.',
      anchor: '/services#motion'
    },
    {
      title: '09. Print & Marketing Collateral',
      desc: 'Brochures, catalogues, stationery and print-ready artwork.',
      anchor: '/services#print'
    },
    {
      title: '10. Presentation & Pitch Decks',
      desc: 'Business presentations, sales decks and investor pitch systems.',
      anchor: '/services#presentation'
    }
  ];

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    onNavigate(path);
  };

  const { siteContent } = useSiteContent();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E6E8ED] py-3.5'
          : 'bg-white/70 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F07822] rounded-lg p-1 -m-1 cursor-pointer"
            aria-label="Goodfolk Solution Home"
          >
            <Logo
              size="md"
              customLogoUrl={siteContent.logoUrl}
              logoText={siteContent.logoText}
              logoSubtitle={siteContent.logoSubtitle}
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            <button
              onClick={() => handleNavClick('/')}
              className={`text-sm font-semibold transition-colors py-1 relative ${
                currentPath === '/' ? 'text-[#173B75]' : 'text-[#242832]/80 hover:text-[#173B75]'
              }`}
            >
              Home
              {currentPath === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F07822] rounded-full" />
              )}
            </button>

            {/* Services with Hover Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleNavClick('/services')}
                className={`flex items-center gap-1 text-sm font-semibold transition-colors py-1 relative ${
                  currentPath === '/services'
                    ? 'text-[#173B75]'
                    : 'text-[#242832]/80 hover:text-[#173B75]'
                }`}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isServicesOpen ? 'rotate-180 text-[#F07822]' : 'text-[#242832]/50'
                  }`}
                />
                {currentPath === '/services' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F07822] rounded-full" />
                )}
              </button>

              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[520px] lg:w-[620px] animate-in fade-in slide-in-from-top-2 duration-200"
                  role="menu"
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-[#E6E8ED] p-3 space-y-2">
                    <div className="px-3 pt-1 pb-2 border-b border-[#E6E8ED]/70 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#173B75] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#F07822]" />
                        All 10 Creative Disciplines
                      </span>
                      <span className="text-[10px] font-mono text-[#F07822] font-semibold">10 Dedicated Services</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 max-h-[360px] overflow-y-auto p-1">
                      {serviceLinks.map((service, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleNavClick(service.anchor)}
                          className="w-full text-left p-2 rounded-xl hover:bg-[#EEF2F9] transition-colors group flex items-start justify-between cursor-pointer"
                          role="menuitem"
                        >
                          <div className="pr-1">
                            <div className="text-xs font-bold text-[#173B75] group-hover:text-[#F07822] transition-colors leading-tight">
                              {service.title}
                            </div>
                            <div className="text-[11px] text-[#242832]/70 leading-snug mt-0.5 line-clamp-1">
                              {service.desc}
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-[#F07822] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 px-2 border-t border-[#E6E8ED]">
                      <button
                        onClick={() => handleNavClick('/services')}
                        className="w-full py-2 text-center text-xs font-bold text-[#173B75] hover:text-[#F07822] transition-colors block bg-[#F7F7F5] rounded-xl hover:bg-[#EEF2F9] cursor-pointer"
                      >
                        Explore All 10 Service Suites & Detail Pages &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('/portfolio')}
              className={`text-sm font-semibold transition-colors py-1 relative ${
                currentPath === '/portfolio' ? 'text-[#173B75]' : 'text-[#242832]/80 hover:text-[#173B75]'
              }`}
            >
              Portfolio
              {currentPath === '/portfolio' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F07822] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('/about')}
              className={`text-sm font-semibold transition-colors py-1 relative ${
                currentPath === '/about' ? 'text-[#173B75]' : 'text-[#242832]/80 hover:text-[#173B75]'
              }`}
            >
              About Us
              {currentPath === '/about' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F07822] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('/contact')}
              className={`text-sm font-semibold transition-colors py-1 relative ${
                currentPath === '/contact' ? 'text-[#173B75]' : 'text-[#242832]/80 hover:text-[#173B75]'
              }`}
            >
              Contact
              {currentPath === '/contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F07822] rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Header Controls: Prominent Orange "Let's Talk" CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenLetsTalk}
              className="bg-[#F07822] hover:bg-[#d65805] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-[#F07822]/20 hover:shadow-lg hover:shadow-[#F07822]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F07822]"
            >
              <span>Let's Talk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenLetsTalk}
              className="bg-[#F07822] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold"
            >
              Let's Talk
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-lg text-[#173B75] hover:bg-[#EEF2F9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B75]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E6E8ED] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('/')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                currentPath === '/' ? 'bg-[#EEF2F9] text-[#173B75]' : 'text-[#242832]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('/services')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                currentPath === '/services' ? 'bg-[#EEF2F9] text-[#173B75]' : 'text-[#242832]'
              }`}
            >
              Services
            </button>
            <div className="pl-6 space-y-1.5 py-1">
              {serviceLinks.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavClick(s.anchor)}
                  className="block w-full text-left text-xs font-medium text-[#242832]/70 hover:text-[#F07822]"
                >
                  · {s.title}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleNavClick('/portfolio')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                currentPath === '/portfolio' ? 'bg-[#EEF2F9] text-[#173B75]' : 'text-[#242832]'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                currentPath === '/about' ? 'bg-[#EEF2F9] text-[#173B75]' : 'text-[#242832]'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('/contact')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                currentPath === '/contact' ? 'bg-[#EEF2F9] text-[#173B75]' : 'text-[#242832]'
              }`}
            >
              Contact
            </button>
          </div>

          <div className="pt-2 border-t border-[#E6E8ED]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenLetsTalk();
              }}
              className="w-full bg-[#F07822] text-white py-3 rounded-xl font-semibold text-center text-sm shadow-md"
            >
              Let's Talk — Connect Instantly
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
