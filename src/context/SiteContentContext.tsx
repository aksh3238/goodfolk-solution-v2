import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  CMSSiteContent, CMSPortfolioItem, CMSTrustedBrand, CMSTestimonial,
  CMSServiceConcept, CMSCustomSection, MediaItem
} from '../types';

interface SiteContentContextType {
  siteContent: CMSSiteContent;
  portfolioProjects: CMSPortfolioItem[];
  trustedBrands: CMSTrustedBrand[];
  testimonials: CMSTestimonial[];
  serviceConcepts: CMSServiceConcept[];
  customSections: CMSCustomSection[];
  mediaLibrary: MediaItem[];
  loading: boolean;
  refreshContent: () => Promise<void>;
}

const defaultSiteContent: CMSSiteContent = {
  logoText: 'GOOD FOLK',
  logoSubtitle: 'SOLUTION',
  heroHeadline: 'We Build Brands That Move Businesses Forward.',
  heroSubheadline: 'We combine strategy, creative design, branding, and digital marketing to help businesses stand out, connect with the right audience, and grow.',
  aboutHeadline: 'Good Ideas Deserve Good Folks.',
  aboutTagline: 'Goodfolk Solution brings strategy, creativity and thoughtful design together to help brands communicate clearly and grow with purpose.',
  aboutStory: 'Goodfolk Solution was built around a simple belief: thoughtful creative work can make a meaningful difference to a business. We bring branding, design and digital communication together to help businesses express their identity and connect with their audience.',
  aboutApproach: 'We begin by understanding the business, the audience and the objective. From there, we develop creative solutions that are relevant, consistent and purposeful.',
  contactEmail: 'akshay@goodfolksolution.in',
  contactPhone: '0000000', // Critical Requirement: Displayed mobile number must be 0000000
  functionalPhoneDestination: '+91 9817961412',
  contactWhatsapp: '+91 9817961412',
  contactInstagram: 'https://www.instagram.com/goodfolksolution/',
  ctaHeadline: 'Ready to Build Something Great?',
  ctaSubheadline: "Have a project in mind? Let's turn your ideas into impactful creative work.",
  portfolioCategories: ['All', 'Branding', 'Packaging', 'Creative Design', 'E-commerce', 'Performance Marketing', 'Video & Social'],
  primaryColor: '#173B75',
  brightBlueColor: '#2458A6',
  accentColor: '#F07822',
  backgroundColor: '#FFF9F1',
  charcoalColor: '#252A34',
  brandProportions: {
    navy: 40,
    softCream: 35,
    brightBlue: 15,
    charcoal: 7,
    warmOrange: 3
  },
  ctaAnimationType: 'particles',
  aboutSectionOrder: ['principles', 'capabilities', 'methodology', 'partnerships'],
  servicesBanner: {
    enabled: true,
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=2000&q=85',
    heading: 'Where Bold Strategy Meets Relentless Creative Craft.',
    subheading: 'From packaging dielines to performance ad creative, we design campaign assets that command attention and drive commercial results.',
    ctaLabel: 'Discuss Your Brief',
    ctaDestination: '#branding',
    focalPoint: 'center',
    badge: 'Creative Direction & Campaign Art',
    isDraft: false
  }
};

const SiteContentContext = createContext<SiteContentContextType>({
  siteContent: defaultSiteContent,
  portfolioProjects: [],
  trustedBrands: [],
  testimonials: [],
  serviceConcepts: [],
  customSections: [],
  mediaLibrary: [],
  loading: false,
  refreshContent: async () => {}
});

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<CMSSiteContent>(defaultSiteContent);
  const [portfolioProjects, setPortfolioProjects] = useState<CMSPortfolioItem[]>([]);
  const [trustedBrands, setTrustedBrands] = useState<CMSTrustedBrand[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [serviceConcepts, setServiceConcepts] = useState<CMSServiceConcept[]>([]);
  const [customSections, setCustomSections] = useState<CMSCustomSection[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/site-content');
      if (res.ok) {
        const data = await res.json();
        if (data.siteContent) setSiteContent(data.siteContent);
        if (data.portfolioProjects) setPortfolioProjects(data.portfolioProjects);
        if (data.trustedBrands) setTrustedBrands(data.trustedBrands);
        if (data.testimonials) setTestimonials(data.testimonials);
        if (data.serviceConcepts) setServiceConcepts(data.serviceConcepts);
        if (data.customSections) setCustomSections(data.customSections);
        if (data.mediaLibrary) setMediaLibrary(data.mediaLibrary);
      }
    } catch (err) {
      console.warn('Using default content fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Update root CSS variables dynamically whenever brand colors change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (siteContent.primaryColor) {
        root.style.setProperty('--color-navy', siteContent.primaryColor);
        root.style.setProperty('--color-primary', siteContent.primaryColor);
      }
      if (siteContent.brightBlueColor) {
        root.style.setProperty('--color-bright-blue', siteContent.brightBlueColor);
      }
      if (siteContent.accentColor) {
        root.style.setProperty('--color-orange', siteContent.accentColor);
        root.style.setProperty('--color-accent', siteContent.accentColor);
      }
      if (siteContent.backgroundColor) {
        root.style.setProperty('--color-soft-cream', siteContent.backgroundColor);
      }
      if (siteContent.charcoalColor) {
        root.style.setProperty('--color-charcoal', siteContent.charcoalColor);
      }
    }
  }, [
    siteContent.primaryColor,
    siteContent.brightBlueColor,
    siteContent.accentColor,
    siteContent.backgroundColor,
    siteContent.charcoalColor
  ]);

  return (
    <SiteContentContext.Provider
      value={{
        siteContent,
        portfolioProjects,
        trustedBrands,
        testimonials,
        serviceConcepts,
        customSections,
        mediaLibrary,
        loading,
        refreshContent: fetchContent
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
