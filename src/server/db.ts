import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  Enquiry, Project, PaymentTransaction, Invoice, Receipt, AdminUser, AdminStats,
  CMSPortfolioItem, CMSTestimonial, CMSTrustedBrand, CMSSiteContent,
  MediaItem, CMSCustomSection, CMSServiceConcept, CMSContentVersion,
  CMSImageSlot, CMSServiceItem
} from '../types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  owner: {
    id: string;
    email: string;
    passwordHash: string;
    salt: string;
    name: string;
    isInitialized: boolean;
  };
  sessions: Record<string, { userId: string; expiresAt: number }>;
  enquiries: Enquiry[];
  projects: Project[];
  payments: PaymentTransaction[];
  invoices: Invoice[];
  receipts: Receipt[];
  // CMS Collections
  siteContent: CMSSiteContent;
  portfolioProjects: CMSPortfolioItem[];
  trustedBrands: CMSTrustedBrand[];
  testimonials: CMSTestimonial[];
  mediaLibrary: MediaItem[];
  customSections: CMSCustomSection[];
  serviceConcepts: CMSServiceConcept[];
  contentVersions: CMSContentVersion[];
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(check, 'hex'), Buffer.from(hash, 'hex'));
}

function getInitialData(): DatabaseSchema {
  const defaultSalt = crypto.randomBytes(16).toString('hex');
  const defaultHash = hashPassword('Goodfolk@2026', defaultSalt);

  return {
    owner: {
      id: 'owner-akshay',
      email: 'akshay@goodfolksolution.in',
      passwordHash: defaultHash,
      salt: defaultSalt,
      name: 'Akshay',
      isInitialized: true
    },
    sessions: {},
    enquiries: [
      {
        id: 'ENQ-2026-1001',
        name: 'Kabir Verma',
        email: 'kabir@zenithorganics.in',
        company: 'Zenith Organics',
        phone: '+91 98201 44512',
        service: 'Branding & Packaging',
        budget: '₹1,50,000 - ₹2,50,000',
        deadline: '4 Weeks',
        details: 'Looking for a comprehensive luxury packaging overhaul for our organic cold-pressed beverage line, along with updated brand guidelines.',
        consent: true,
        status: 'Converted',
        internalNotes: 'Discussed requirements on call. Converted to Project GF-PRJ-2026-01.',
        convertedProjectId: 'GF-PRJ-2026-01',
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      {
        id: 'ENQ-2026-1002',
        name: 'Sneha Roy',
        email: 'sneha@auraapparel.co',
        company: 'Aura Sustainable Apparel',
        phone: '+91 98711 23098',
        service: 'Performance Marketing Creatives',
        budget: '₹80,000 - ₹1,20,000',
        deadline: '2 Weeks',
        details: 'Need 15 high-converting ad creative variations (static + video reels) for Meta and Google ads for our upcoming festive collection.',
        consent: true,
        status: 'Contacted',
        internalNotes: 'Shared portfolio deck and rate card. Awaiting client review.',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'ENQ-2026-1003',
        name: 'Devansh Kulkarni',
        email: 'dev@novanutrition.com',
        company: 'Nova Nutrition',
        phone: '+91 97654 89123',
        service: 'Creative Design',
        budget: '₹1,00,000',
        deadline: '3 Weeks',
        details: 'Amazon A+ content design for 4 SKU product pages and 3D mockups for retail website banner.',
        consent: true,
        status: 'New',
        internalNotes: 'Received via Contact page. Needs briefing call.',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ],
    projects: [
      {
        id: 'GF-PRJ-2026-01',
        clientName: 'Zenith Organics',
        contactEmail: 'kabir@zenithorganics.in',
        contactPhone: '+91 98201 44512',
        projectName: 'Artisanal Cold-Pressed Juice Brand & Packaging',
        services: ['Branding & Packaging', 'Creative Design'],
        agreedAmount: 185000,
        startDate: '2026-10-10',
        deadline: '2026-11-15',
        status: 'In Progress',
        internalNotes: 'Initial moodboards approved. Label dielines underway.',
        clientPaymentToken: 'zenith-pay-981796',
        enquiryId: 'ENQ-2026-1001',
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'GF-PRJ-2026-02',
        clientName: 'Kaveri Botanicals',
        contactEmail: 'contact@kaveribotanicals.in',
        contactPhone: '+91 99002 88419',
        projectName: 'Ayurvedic Skincare Brand Identity & Launch Ads',
        services: ['Branding & Packaging', 'Performance Marketing Creatives'],
        agreedAmount: 220000,
        startDate: '2026-09-20',
        deadline: '2026-10-25',
        status: 'Review & Revisions',
        internalNotes: 'Final packaging approved. Ad creatives in review.',
        clientPaymentToken: 'kaveri-pay-441238',
        createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
      }
    ],
    payments: [
      {
        id: 'PAY-2026-3001',
        projectId: 'GF-PRJ-2026-01',
        clientName: 'Zenith Organics',
        amount: 92500,
        utr: '428819034112',
        upiId: '9817961412@ibl',
        paymentDate: '2026-10-11T11:30:00.000Z',
        status: 'Verified',
        verifiedAt: '2026-10-11T12:15:00.000Z',
        verifiedBy: 'Akshay',
        notes: '50% Advance received in bank account via UPI.',
        receiptId: 'REC-2026-01',
        createdAt: '2026-10-11T11:30:00.000Z'
      },
      {
        id: 'PAY-2026-3002',
        projectId: 'GF-PRJ-2026-02',
        clientName: 'Kaveri Botanicals',
        amount: 110000,
        utr: '426510982341',
        upiId: '9817961412@ibl',
        paymentDate: '2026-09-22T15:20:00.000Z',
        status: 'Verified',
        verifiedAt: '2026-09-22T16:00:00.000Z',
        verifiedBy: 'Akshay',
        notes: '50% Advance payment verified in bank.',
        receiptId: 'REC-2026-02',
        createdAt: '2026-09-22T15:20:00.000Z'
      },
      {
        id: 'PAY-2026-3003',
        projectId: 'GF-PRJ-2026-02',
        clientName: 'Kaveri Botanicals',
        amount: 110000,
        utr: '429012339845',
        upiId: '9817961412@ibl',
        paymentDate: '2026-10-17T09:45:00.000Z',
        status: 'Pending Verification',
        notes: 'Client submitted final milestone payment UTR for verification.',
        createdAt: '2026-10-17T09:45:00.000Z'
      }
    ],
    invoices: [
      {
        id: 'INV-2026-01',
        projectId: 'GF-PRJ-2026-01',
        clientName: 'Zenith Organics',
        contactEmail: 'kabir@zenithorganics.in',
        contactPhone: '+91 98201 44512',
        projectName: 'Artisanal Cold-Pressed Juice Brand & Packaging',
        amount: 185000,
        lineItems: [
          { description: 'Comprehensive Brand Identity System & Guidelines', amount: 85000 },
          { description: 'Product Packaging Design for 4 SKUs & Production Dielines', amount: 80000 },
          { description: 'Creative 3D Realistic Bottle Renders & Digital Assets', amount: 20000 }
        ],
        issueDate: '2026-10-10',
        dueDate: '2026-10-20',
        status: 'Partially Paid',
        notes: 'Terms: 50% advance before kickoff, 50% upon final artwork approval. Payment via UPI to 9817961412@ibl.',
        upiId: '9817961412@ibl',
        createdAt: '2026-10-10T08:00:00.000Z'
      },
      {
        id: 'INV-2026-02',
        projectId: 'GF-PRJ-2026-02',
        clientName: 'Kaveri Botanicals',
        contactEmail: 'contact@kaveribotanicals.in',
        contactPhone: '+91 99002 88419',
        projectName: 'Ayurvedic Skincare Brand Identity & Launch Ads',
        amount: 220000,
        lineItems: [
          { description: 'Visual Identity, Luxury Glass Packaging & Box Design', amount: 140000 },
          { description: 'Performance Ad Creatives & Video Reel Assets', amount: 80000 }
        ],
        issueDate: '2026-09-20',
        dueDate: '2026-10-05',
        status: 'Partially Paid',
        notes: '50% advance milestone received. Balance pending verification.',
        upiId: '9817961412@ibl',
        createdAt: '2026-09-20T09:00:00.000Z'
      }
    ],
    receipts: [
      {
        id: 'REC-2026-01',
        paymentId: 'PAY-2026-3001',
        projectId: 'GF-PRJ-2026-01',
        invoiceId: 'INV-2026-01',
        clientName: 'Zenith Organics',
        amountReceived: 92500,
        utr: '428819034112',
        verifiedDate: '2026-10-11T12:15:00.000Z',
        agreedProjectAmount: 185000,
        totalVerifiedPaid: 92500,
        remainingBalance: 92500,
        isFinalReceipt: false,
        createdAt: '2026-10-11T12:15:00.000Z'
      },
      {
        id: 'REC-2026-02',
        paymentId: 'PAY-2026-3002',
        projectId: 'GF-PRJ-2026-02',
        invoiceId: 'INV-2026-02',
        clientName: 'Kaveri Botanicals',
        amountReceived: 110000,
        utr: '426510982341',
        verifiedDate: '2026-09-22T16:00:00.000Z',
        agreedProjectAmount: 220000,
        totalVerifiedPaid: 110000,
        remainingBalance: 110000,
        isFinalReceipt: false,
        createdAt: '2026-09-22T16:00:00.000Z'
      }
    ],
    // CMS Initial Data
    siteContent: {
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
      functionalPhoneDestination: '+91 9817961412', // Functional destination for WhatsApp/dialer
      contactWhatsapp: '+91 9817961412',
      contactInstagram: 'https://www.instagram.com/goodfolksolution/',
      ctaHeadline: 'Ready to Build Something Great?',
      ctaSubheadline: "Have a project in mind? Let's turn your ideas into impactful creative work.",
      portfolioCategories: ['All', 'Branding', 'Packaging', 'Creative Design', 'E-commerce', 'Performance Marketing', 'Video & Social'],
      processSteps: [
        {
          id: 'step-1',
          number: '01',
          title: 'Brief',
          subtitle: 'Strategic Discovery',
          desc: 'We begin by aligning on commercial goals, audience insights, and design constraints before creative work begins.',
          iconName: 'Compass',
          badge: 'Step 1: Alignment'
        },
        {
          id: 'step-2',
          number: '02',
          title: 'Create',
          subtitle: 'Design Sprints & Craft',
          desc: 'Translating strategy into distinct brand identity, retail packaging dielines, and performance ad visuals.',
          iconName: 'Sparkles',
          badge: 'Step 2: Prototyping'
        },
        {
          id: 'step-3',
          number: '03',
          title: 'Review & Approve',
          subtitle: 'Direct Stakeholder Feedback',
          desc: 'Collaborative feedback cycles, rigorous typography & color calibration, ensuring everything meets exacting standards.',
          iconName: 'CheckCircle',
          badge: 'Step 3: Refinement'
        },
        {
          id: 'step-4',
          number: '04',
          title: 'Deliver & Pay',
          subtitle: 'Master Assets & Direct UPI',
          desc: 'Final production-ready files delivered alongside transparent direct UPI settlement with manual receipt confirmation.',
          iconName: 'ShieldCheck',
          badge: 'Step 4: Delivery'
        }
      ],
      heroSlides: [
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
      ],
      websiteImages: [
        {
          id: 'slot-brand-logo',
          page: 'global',
          section: 'Header / Navigation',
          title: 'Main Agency Wordmark & Emblem',
          currentUrl: '',
          recommendedDimensions: '240 × 60 px',
          actualDimensions: '240 × 60 px',
          aspectRatio: '4:1',
          maxSize: '2 MB',
          formats: ['SVG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Good Folk Solution Wordmark Logo'
        },
        {
          id: 'slot-brand-emblem',
          page: 'global',
          section: 'Favicon & App Icon',
          title: 'Geometric 4-Node Emblem',
          currentUrl: '',
          recommendedDimensions: '512 × 512 px',
          actualDimensions: '512 × 512 px',
          aspectRatio: '1:1',
          maxSize: '1 MB',
          formats: ['SVG', 'PNG'],
          focalPoint: 'center',
          altText: 'Good Folk Solution Emblem Icon'
        },
        {
          id: 'slot-home-hero-1',
          page: 'home',
          section: 'Hero Showcase Slide 1 (Packaging)',
          title: 'Packaging & Brand Identity Showcase',
          currentUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=80',
          desktopUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1920&q=80',
          mobileUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=750&q=80',
          recommendedDimensions: '1920 × 700 px (Desktop) / 750 × 1100 px (Mobile)',
          actualDimensions: '1920 × 700 px',
          aspectRatio: '16:6 (2.74:1)',
          maxSize: '5 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Packaging and brand identity craft banner'
        },
        {
          id: 'slot-home-hero-2',
          page: 'home',
          section: 'Hero Showcase Slide 2 (Performance)',
          title: 'Performance Ad Creatives & Growth Visual',
          currentUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '1920 × 700 px (Desktop) / 750 × 1100 px (Mobile)',
          actualDimensions: '1920 × 700 px',
          aspectRatio: '16:6 (2.74:1)',
          maxSize: '5 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Performance ad creatives and growth marketing banner'
        },
        {
          id: 'slot-home-hero-3',
          page: 'home',
          section: 'Hero Showcase Slide 3 (Video)',
          title: 'Cinematic Product Reels & Motion Visual',
          currentUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '1920 × 700 px',
          actualDimensions: '1920 × 700 px',
          aspectRatio: '16:6 (2.74:1)',
          maxSize: '5 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Cinematic video production and reels showcase'
        },
        {
          id: 'slot-home-hero-4',
          page: 'home',
          section: 'Hero Showcase Slide 4 (Optimization)',
          title: 'Ad Spend & CAC Optimization Visual',
          currentUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '1920 × 700 px',
          actualDimensions: '1920 × 700 px',
          aspectRatio: '16:6 (2.74:1)',
          maxSize: '5 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Ad spend analysis and analytics dashboard'
        },
        {
          id: 'slot-home-hero-5',
          page: 'home',
          section: 'Hero Showcase Slide 5 (Portfolio)',
          title: 'Comprehensive Brand Direction Visual',
          currentUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '1920 × 700 px',
          actualDimensions: '1920 × 700 px',
          aspectRatio: '16:6 (2.74:1)',
          maxSize: '5 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Comprehensive brand direction portfolio'
        },
        {
          id: 'slot-home-cta-bg',
          page: 'home',
          section: 'Final CTA Section',
          title: "Let's Talk Convergence Canvas Background",
          currentUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80',
          recommendedDimensions: '1920 × 600 px',
          actualDimensions: '1920 × 600 px',
          aspectRatio: '16:5 (3.2:1)',
          maxSize: '4 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Final convergence call to action background'
        },
        {
          id: 'slot-services-header',
          page: 'services',
          section: 'Services Header Banner',
          title: 'Full-Width Creative Capabilities Banner',
          currentUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80',
          recommendedDimensions: '1600 × 600 px',
          actualDimensions: '1600 × 600 px',
          aspectRatio: '8:3 (2.67:1)',
          maxSize: '4 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Our creative services and strategic disciplines'
        },
        {
          id: 'slot-service-branding',
          page: 'services',
          section: 'Discipline 01: Brand Identity & Packaging',
          title: 'Tactile Identity & Packaging Dieline Photo',
          currentUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '800 × 600 px',
          actualDimensions: '800 × 600 px',
          aspectRatio: '4:3 (1.33:1)',
          maxSize: '3 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Tactile brand packaging and label design'
        },
        {
          id: 'slot-service-creative',
          page: 'services',
          section: 'Discipline 02: Creative Design',
          title: 'Digital Design & Social Collateral Visual',
          currentUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '800 × 600 px',
          actualDimensions: '800 × 600 px',
          aspectRatio: '4:3 (1.33:1)',
          maxSize: '3 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Creative design, Amazon A+ content and marketing collateral'
        },
        {
          id: 'slot-service-performance',
          page: 'services',
          section: 'Discipline 03: Performance Marketing Creatives',
          title: 'Growth & Paid Advertising Visual',
          currentUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '800 × 600 px',
          actualDimensions: '800 × 600 px',
          aspectRatio: '4:3 (1.33:1)',
          maxSize: '3 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Performance marketing ad creatives and growth dashboard'
        },
        {
          id: 'slot-service-video',
          page: 'services',
          section: 'Discipline 04: Video Production & Editing',
          title: 'Studio Cinematic Reels & Motion Visual',
          currentUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '800 × 600 px',
          actualDimensions: '800 × 600 px',
          aspectRatio: '4:3 (1.33:1)',
          maxSize: '3 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Video production, color grading and motion graphics'
        },
        {
          id: 'slot-service-digital',
          page: 'services',
          section: 'Discipline 05: Digital Marketing & Social Media',
          title: 'Social Strategy & Community Roadmap Visual',
          currentUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '800 × 600 px',
          actualDimensions: '800 × 600 px',
          aspectRatio: '4:3 (1.33:1)',
          maxSize: '3 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Social media management, strategy and content curation'
        },
        {
          id: 'slot-service-strategy',
          page: 'services',
          section: 'Discipline 06: Strategy & Brand Direction',
          title: 'Strategic Workshop & Brand Blueprint Visual',
          currentUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '800 × 600 px',
          actualDimensions: '800 × 600 px',
          aspectRatio: '4:3 (1.33:1)',
          maxSize: '3 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Brand strategy workshop and collaborative planning'
        },
        {
          id: 'slot-about-story',
          page: 'about',
          section: 'Our Story & Approach',
          title: 'Studio Collaboration & Strategic Planning Photo',
          currentUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1000&q=80',
          recommendedDimensions: '1200 × 900 px',
          actualDimensions: '1000 × 750 px',
          aspectRatio: '4:3 (1.33:1)',
          maxSize: '4 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Studio team collaborating on creative brand direction'
        },
        {
          id: 'slot-about-principles',
          page: 'about',
          section: 'Section 1: Foundational Values — Our Principles',
          title: 'Principles Craft Graphic',
          currentUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '1200 × 800 px',
          actualDimensions: '1200 × 800 px',
          aspectRatio: '3:2 (1.5:1)',
          maxSize: '3 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Our foundational values and principles'
        },
        {
          id: 'slot-about-methodology',
          page: 'about',
          section: 'Section 3: Working Methodology',
          title: 'Methodology Agile Timeline Visual',
          currentUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '1200 × 650 px',
          actualDimensions: '1200 × 650 px',
          aspectRatio: '16:9 (1.78:1)',
          maxSize: '3 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Working methodology from brief to delivery'
        },
        {
          id: 'slot-portfolio-banner',
          page: 'portfolio',
          section: 'Portfolio Showcase Header',
          title: 'Client Work & Case Studies Hero Banner',
          currentUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80',
          recommendedDimensions: '1920 × 500 px',
          actualDimensions: '1920 × 500 px',
          aspectRatio: '16:4 (4:1)',
          maxSize: '4 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Portfolio showcase and creative works banner'
        },
        {
          id: 'slot-contact-hero',
          page: 'contact',
          section: 'Direct Channels & Inquiries Header',
          title: 'Studio Brief Submission Graphic',
          currentUrl: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80',
          recommendedDimensions: '1200 × 600 px',
          actualDimensions: '1200 × 600 px',
          aspectRatio: '2:1',
          maxSize: '3 MB',
          formats: ['JPG', 'PNG', 'WebP'],
          focalPoint: 'center',
          altText: 'Contact Good Folk Solution creative studio'
        },
        {
          id: 'slot-payment-upi-qr',
          page: 'global',
          section: 'Client UPI Payment Modal',
          title: 'Official UPI Merchant QR Code Graphic',
          currentUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=9817961412@ibl&pn=Goodfolk%20Solution&cu=INR',
          recommendedDimensions: '800 × 800 px',
          actualDimensions: '800 × 800 px',
          aspectRatio: '1:1',
          maxSize: '2 MB',
          formats: ['PNG', 'SVG', 'WebP'],
          focalPoint: 'center',
          altText: 'Official UPI QR Code for Goodfolk Solution'
        }
      ],
      services: [
        {
          id: 'branding',
          slug: 'branding-and-packaging',
          number: '01',
          title: 'Brand Identity & Packaging',
          shortDesc: 'Brand identity, logo design and product packaging.',
          fullDesc: 'We craft comprehensive visual identity systems and tangible packaging that stand out on retail shelves and e-commerce screens. Every element is engineered to communicate your core values, evoke emotion, and build enduring brand equity.',
          image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=80',
          deliverables: [
            'Brand identity and visual systems',
            'Logo design and brand applications',
            'Product packaging and label design',
            'Print-ready dielines & production finishes (foil, spot UV, embossing)',
            'Comprehensive brand guideline books & digital asset kits',
            'Brand consistency across physical and digital touchpoints'
          ],
          keyHighlights: [
            'Custom typographic marks and bespoke iconography',
            'Shelf-impact analysis for physical and retail products',
            'Certified dielines for manufacturers & offset printers'
          ],
          ctaText: 'Discuss Your Project',
          ctaDestination: '/contact',
          order: 1,
          published: true
        },
        {
          id: 'creative',
          slug: 'creative-design',
          number: '02',
          title: 'Creative Design',
          shortDesc: 'Social media posts, Amazon A+ content, website assets, image editing and photo albums.',
          fullDesc: 'From high-converting Amazon storefronts to scroll-stopping social visuals, we create purposeful digital and print collateral that elevates your brand perception and engages your target audience.',
          image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
          deliverables: [
            'Social media posts and campaign assets',
            'Amazon A+ content and e-commerce creatives',
            'Website banners, hero visuals and digital assets',
            'Professional image editing, color grading and photo albums',
            'Digital brochures, flyers, lookbooks and print collateral',
            'Custom vector illustrations and branded infographics'
          ],
          keyHighlights: [
            'Conversion-optimized marketplace layouts (Amazon, Flipkart, Shopify)',
            'Multi-format export optimized for web speed and high DPI displays',
            'Unified aesthetic across all brand customer touchpoints'
          ],
          ctaText: 'Discuss Your Project',
          ctaDestination: '/contact',
          order: 2,
          published: true
        },
        {
          id: 'performance',
          slug: 'performance-marketing-creatives',
          number: '03',
          title: 'Performance Marketing Creatives',
          shortDesc: 'Ad creatives designed to capture attention and drive conversions.',
          fullDesc: 'Creative is the new targeting. We develop ad creatives specifically engineered to stop the scroll, clarify the value proposition within 3 seconds, and trigger profitable action across Meta, Google, and digital display channels.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          deliverables: [
            'Paid advertising creatives (static banners, carousels, video overlays)',
            'Campaign concepts and systematic visual variations',
            'Product-focused advertising layouts with clear value pillars',
            'Creative adaptations for 9:16 Stories/Reels, 4:5 Feeds, and 1:1 Displays',
            'A/B testing creative variations to lower customer acquisition cost (CAC)',
            'Seasonal promotional and festive campaign creative suites'
          ],
          keyHighlights: [
            'Framework-driven hook and headline variations',
            'Direct-response visual psychology applied to each asset',
            'Rapid iteration based on campaign performance metrics'
          ],
          ctaText: 'Discuss Your Project',
          ctaDestination: '/contact',
          order: 3,
          published: true
        },
        {
          id: 'video',
          slug: 'video-production-and-editing',
          number: '04',
          title: 'Video Production & Editing',
          shortDesc: 'Promotional videos, reels and product videos.',
          fullDesc: 'Video is the most powerful medium for brand storytelling. We shoot, edit, color grade, and polish promotional videos, commercial reels, and product demonstrations that captivate audiences and inspire confidence.',
          image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
          deliverables: [
            'Promotional videos and brand films',
            'Short-form reels, TikToks, and YouTube Shorts',
            'Product showcase videos and unboxing motion assets',
            'Video editing, sound design, and color grading',
            'Kinetic motion typography, 2D animation and logo stingers',
            'Campaign video adaptations across all social aspect ratios'
          ],
          keyHighlights: [
            'Paced for short attention spans with dynamic motion retention hooks',
            'Studio-grade sound mixing and licensed commercial soundtracking',
            'Platform-native subtitle styling and high-retention editing'
          ],
          ctaText: 'Discuss Your Project',
          ctaDestination: '/contact',
          order: 4,
          published: true
        },
        {
          id: 'digital',
          slug: 'digital-marketing-and-social-media',
          number: '05',
          title: 'Digital Marketing & Social Media Management',
          shortDesc: 'Social media management, content planning and campaign execution.',
          fullDesc: 'We manage your brand presence with structured content planning, strategic narrative building, and proactive community engagement. Transform your social channels from passive profiles into authoritative growth engines.',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
          deliverables: [
            'Social media channel management & curation',
            'Strategic content calendar development & visual roadmaps',
            'Campaign execution and coordination across platforms',
            'Brand voice, copywriting and caption frameworks',
            'Community engagement strategies and hashtag optimization',
            'Monthly performance analysis and creative optimization reports'
          ],
          keyHighlights: [
            'Consistent publishing schedule and premium visual aesthetic',
            'Cross-channel cohesive brand voice and messaging',
            'Data-driven insights to refine future creative strategy'
          ],
          ctaText: 'Discuss Your Project',
          ctaDestination: '/contact',
          order: 5,
          published: true
        },
        {
          id: 'strategy',
          slug: 'strategy-and-brand-direction',
          number: '06',
          title: 'Strategy & Brand Direction',
          shortDesc: 'Comprehensive commercial strategy, positioning and creative advisory.',
          fullDesc: 'Strategic positioning is the foundation of enduring category leadership. We collaborate with founders to craft sharp value propositions, audience segmentation models, and high-impact go-to-market roadmaps.',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
          deliverables: [
            'Category positioning & competitive whitespace audit',
            'Customer persona architecture & value proposition design',
            'Go-to-market rollout & launch campaign roadmaps',
            'Creative direction & brand governance playbooks'
          ],
          keyHighlights: [
            'Direct alignment between brand aesthetics and unit economics',
            'Actionable creative guidelines for cross-functional teams'
          ],
          ctaText: 'Discuss Your Project',
          ctaDestination: '/contact',
          order: 6,
          published: true
        }
      ],
      primaryColor: '#173B75', // Exact approved Navy
      brightBlueColor: '#2458A6', // Exact approved Bright Blue
      accentColor: '#F07822', // Exact approved Warm Orange
      backgroundColor: '#FFF9F1', // Exact approved Soft Cream
      charcoalColor: '#252A34', // Exact approved Charcoal
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
        isDraft: false,
        updatedAt: new Date().toISOString()
      },
      isDraft: false,
      lastPublishedAt: new Date().toISOString()
    },
    portfolioProjects: [
      {
        id: 'zenith-botanicals',
        title: 'Zenith Artisanal Elixirs',
        category: 'Packaging',
        tagline: 'Luxury cold-pressed juice packaging, tactile label dielines and brand identity system.',
        // Fixed reliable working Unsplash packaging image (verified HTTP 200)
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Create an elevated, shelf-stopping brand presence and sustainable glass packaging suite for a cold-pressed wellness beverage line.',
        approach: 'We developed an editorial typographic language paired with custom botanical emboss accents, earthy gradients, and compliant nutrition dielines ready for offset print.',
        deliverables: [
          'Visual Identity Guidelines',
          '4 SKU Bottle Label Dielines',
          'Foil-Stamp & Emboss Specifications',
          '3D Realistic Product Renders',
          'Secondary Shipping Box Design'
        ],
        specs: {
          format: 'Print-ready Vector AI + 3D CAD Renders',
          timeline: '3 Weeks',
          tools: 'Illustrator, Cinema4D, InDesign'
        },
        tags: ['Packaging', 'Beverage', 'Dielines'],
        published: true,
        order: 1
      },
      {
        id: 'aeris-skincare',
        title: 'Aeris Botanical Skincare',
        category: 'Branding',
        tagline: 'Minimalist skincare visual identity, frosted cosmetic bottles and retail visual system.',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Develop a modern, clean aesthetic for a dermatologically-tested organic skincare startup entering competitive direct-to-consumer and retail markets.',
        approach: 'Balanced medical precision with serene natural warmth. Crafted a custom geometric wordmark with tactile micro-textures and subtle amber and slate tones.',
        deliverables: [
          'Comprehensive Logo Suite',
          'Dropper Bottle & Jar Packaging',
          'Unboxing Experience & Tissue Paper',
          'Digital Brand Guidelines (42-page PDF)',
          'Retail Display Counter Visuals'
        ],
        specs: {
          format: 'CMYK Pantone Matched + Digital Web Kit',
          timeline: '4 Weeks',
          tools: 'Figma, Illustrator, Photoshop'
        },
        tags: ['Branding', 'Cosmetics', 'Identity'],
        published: true,
        order: 2
      },
      {
        id: 'kaviar-coldbrew',
        title: 'Kaviar Nitro Cold Brew',
        category: 'Creative Design',
        tagline: 'Modern aluminum can design, Amazon A+ storefront banners and e-commerce launch assets.',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Design a bold, striking matte-black nitro cold brew can series alongside high-converting digital storefront assets for marketplace launch.',
        approach: 'Utilized bold neo-grotesque typography, high-contrast monochrome patterns, and dynamic condensation lighting to create maximum appetite appeal.',
        deliverables: [
          'Matte Finish 250ml Can Graphics',
          'Amazon A+ Enhanced Brand Content Modules',
          'Shopify Hero Banners & Product Cards',
          'High-Resolution Retouched Hero Shots',
          'Social Launch Grid Visuals'
        ],
        specs: {
          format: 'Rotary Print Aluminum Specs + RGB Web',
          timeline: '2.5 Weeks',
          tools: 'Illustrator, Blender, Photoshop'
        },
        tags: ['E-commerce', 'Amazon A+', 'Beverage'],
        published: true,
        order: 3
      },
      {
        id: 'lumina-sound',
        title: 'Lumina Wireless Audio Campaign',
        category: 'Performance Marketing',
        tagline: 'Conversion-engineered Meta and Google paid ad creative matrix featuring motion variations.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Build a rigorous performance creative system for an audiophile headphone launch to reduce customer acquisition costs across Instagram, Facebook, and YouTube.',
        approach: 'Engineered 18 hook variations focusing on active noise cancellation, deep bass clarity, and premium matte build. Formatted for 9:16 reels, 4:5 feeds, and 1:1 carousels.',
        deliverables: [
          '18 Static Ad Creative Variations',
          '6 Short-Form Motion Hooks (15s)',
          'A/B Headline and Call-to-Action Variations',
          'Story Ad Layouts with Swipe-Up Guides',
          'Performance Creative Playbook'
        ],
        specs: {
          format: 'MP4 (H.264) + Static PNG/WEBP Assets',
          timeline: '2 Weeks',
          tools: 'After Effects, Premiere Pro, Figma'
        },
        tags: ['Performance Ads', 'Social', 'Consumer Tech'],
        published: true,
        order: 4
      },
      {
        id: 'roast-republic',
        title: 'Roast Republic Coffee Roasters',
        category: 'Packaging',
        tagline: 'Artisanal compostable coffee pouch packaging, roast level iconography and retail boxes.',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Establish distinct single-origin packaging with color-coded origin tags and eco-conscious kraft materials.',
        approach: 'Created clean modular labeling that allows the roaster to quickly apply custom roast labels onto uniform sustainable pouch bags while maintaining premium prestige.',
        deliverables: [
          'Pouch Bag Dielines (250g & 1kg)',
          'Custom Origin & Flavor Profile Badges',
          'Degassing Valve Placement Specs',
          'Subscription Box Packaging',
          'Digital E-Commerce Product Cards'
        ],
        specs: {
          format: 'FSC Certified Dielines & Print Files',
          timeline: '3 Weeks',
          tools: 'Illustrator, InDesign'
        },
        tags: ['Packaging', 'Coffee', 'Eco-friendly'],
        published: true,
        order: 5
      },
      {
        id: 'aurora-fashion',
        title: 'Aurora Studio Summer Campaign',
        category: 'Video & Social',
        tagline: 'High-energy fashion reels, lookbook photography editing and organic social campaign rollout.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Produce and edit seasonal fashion short-form videos and a 30-day Instagram aesthetic layout for contemporary linen apparel.',
        approach: 'Employed rhythmic cut transitions, film grain textures, and natural daylight grading to communicate breezy summer elegance.',
        deliverables: [
          '12 Edited Instagram Reels & TikToks',
          '30-Day Curated Social Media Grid',
          'High-Fashion Lookbook Retouching',
          'Story Templates & Interactive Poll Visuals',
          'Audio Synchronization & Subtitle Layouts'
        ],
        specs: {
          format: '1080x1920 60fps Reels + 1080x1350 Posts',
          timeline: '3.5 Weeks',
          tools: 'DaVinci Resolve, Photoshop, Lightroom'
        },
        tags: ['Video', 'Fashion', 'Reels'],
        published: true,
        order: 6
      },
      {
        id: 'veloce-mobility',
        title: 'Veloce Urban Mobility Platform',
        category: 'Website & UI/UX',
        tagline: 'Modern electric mobility booking web application, responsive dashboard and brand design system.',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Design a clean, responsive web interface and booking user journey for a next-generation urban electric bike fleet subscription service.',
        approach: 'Streamlined the user journey to complete a fleet reservation in under 4 taps. Built a robust component design system with light/dark adaptive tokens.',
        brandStrategy: 'Deliver ultra-fast, zero-friction booking with dynamic battery-range estimations and interactive pickup zone mapping.',
        colorPalette: ['#0B1528', '#2458A6', '#10B981', '#FFFFFF'],
        typographyNotes: 'Inter font with tabular numeric alignments for live GPS distances and tariff calculators.',
        deliverables: [
          'Complete Web UI/UX Design System in Figma',
          'Interactive High-Fidelity Clickable Prototype',
          'User Onboarding & KYC Identity Flow',
          'Responsive Mobile & Tablet Viewport Specifications',
          'Developer Handoff Token Documentation'
        ],
        specs: {
          format: 'Figma Auto-Layout System + React Tokens',
          timeline: '4 Weeks',
          tools: 'Figma, Principle, Illustrator'
        },
        tags: ['UI/UX', 'Web Design', 'SaaS'],
        published: true,
        order: 7
      },
      {
        id: 'terra-apothecary',
        title: 'Terra Natural Apothecary',
        category: 'Branding & Packaging',
        tagline: 'Herbal remedy tincture bottles, foil-stamped carton boxes and botanical brand identity.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Create an authentic botanical apothecary brand identity and packaging suite for adaptogenic mushroom and herbal tinctures.',
        approach: 'Drew from vintage copperplate engravings and botanical taxonomies, combined with ultra-modern foil stamping on textured FSC paper stock.',
        brandStrategy: 'Honors ancient herbal wisdom with rigorous modern clinical safety, positioning the apothecary as an essential daily vitality staple.',
        colorPalette: ['#173B75', '#B87333', '#F4F1EA', '#2D3748'],
        typographyNotes: 'Classic transition serif paired with monospaced lot numbers and botanical Latin names.',
        deliverables: [
          'Brand Mark, Monogram & Wax Stamp Seal',
          '5 Tincture Bottle Dielines & Dropper Assemblies',
          'Secondary Box Packaging with Blind Debossing',
          'Herbarium Illustrated Iconography Suite',
          'Official Brand Guidelines Manual'
        ],
        specs: {
          format: 'Pantone Metallic Foil + Vector Dielines',
          timeline: '3 Weeks',
          tools: 'Illustrator, InDesign, Blender'
        },
        tags: ['Branding', 'Packaging', 'Wellness'],
        published: true,
        order: 8
      },
      {
        id: 'stride-performance',
        title: 'Stride Athletic Motion Graphics',
        category: 'Motion Graphics',
        tagline: 'Kinetic 3D footwear motion ads, dynamic typography reveals and 60fps social campaign visuals.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Develop high-impact kinetic motion graphics and 3D product animation teasers for an innovative carbon-plated running shoe launch.',
        approach: 'Constructed dynamic explosion diagrams of the shoe foam sole layers, synchronized to high-energy bass transitions and glitch typography.',
        brandStrategy: 'Convey explosive speed, forward momentum, and cutting-edge propulsion technology through hyper-kinetic editing.',
        colorPalette: ['#0A0E17', '#F07822', '#2458A6', '#E2E8F0'],
        typographyNotes: 'Heavy oblique neo-grotesque type animated with variable-weight keyframe interpolation.',
        deliverables: [
          '30s 3D Product Teaser Commercial',
          '6 Multi-Format Social Motion Cuts (9:16 & 1:1)',
          'Kinetic Typography Stinger Packages',
          'Exploded Sole Architecture Motion Render',
          'Audio Design & Custom Sound Effects Track'
        ],
        specs: {
          format: '4K ProRes 422 HQ + H.264 Social Exports',
          timeline: '3 Weeks',
          tools: 'Cinema4D, After Effects, Octane Render'
        },
        tags: ['Motion', '3D', 'Footwear'],
        published: true,
        order: 9
      },
      {
        id: 'novanutrition-deck',
        title: 'Nova Nutrition Series A Investor Deck',
        category: 'Presentation Design',
        tagline: '28-slide investor pitch presentation, market opportunity models and branded presentation system.',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
        isConcept: true,
        brief: 'Design a high-stakes, 28-slide investor pitch deck for a personalized nutritional biotech venture raising an $8M Series A round.',
        approach: 'Transformed complex clinical assay data and market CAGR growth models into clear, intuitive infographics with executive typographic hierarchy.',
        brandStrategy: 'Position the venture at the intersection of proven clinical bioscience and scalable consumer subscription software.',
        colorPalette: ['#173B75', '#F07822', '#2458A6', '#F8FAFC'],
        typographyNotes: 'Poppins for bold executive headings paired with Inter for clean financial data tables.',
        deliverables: [
          '28 Fully Editable Master Pitch Deck Slides',
          'Bespoke Market Opportunity & Financial Models',
          'Traction Roadmap & Unit Economics Charts',
          'Light and Dark Presenter Theme Templates',
          'Keynote, PowerPoint and Google Slides Formats'
        ],
        specs: {
          format: '16:9 Widescreen .KEY, .PPTX, and .PDF',
          timeline: '2 Weeks',
          tools: 'Figma, Keynote, PowerPoint, Illustrator'
        },
        tags: ['Presentation', 'Pitch Deck', 'BioTech'],
        published: true,
        order: 10
      }
    ],
    trustedBrands: [
      { id: 'tb-1', name: 'Zenith Organics', logoUrl: '', order: 1, active: true },
      { id: 'tb-2', name: 'Kaveri Botanicals', logoUrl: '', order: 2, active: true },
      { id: 'tb-3', name: 'Kaviar Nitro Cold Brew', logoUrl: '', order: 3, active: true },
      { id: 'tb-4', name: 'Lumina Wireless Audio', logoUrl: '', order: 4, active: true },
      { id: 'tb-5', name: 'Roast Republic', logoUrl: '', order: 5, active: true },
      { id: 'tb-6', name: 'Aura Sustainable Apparel', logoUrl: '', order: 6, active: true },
      { id: 'tb-7', name: 'Nova Nutrition Labs', logoUrl: '', order: 7, active: true },
      { id: 'tb-8', name: 'Apex Consumer Goods', logoUrl: '', order: 8, active: true }
    ],
    testimonials: [
      {
        id: 'test-1',
        clientName: 'Client Review (In Progress)',
        company: 'Zenith Organics',
        designation: 'Founder & Managing Director',
        photoUrl: '',
        rating: 5,
        text: 'Working with Goodfolk Solution transformed our packaging dielines. Their team balanced retail shelf presence with sustainable glass bottling standards.',
        category: 'Branding & Packaging',
        published: true,
        order: 1,
        isPlaceholder: true
      },
      {
        id: 'test-2',
        clientName: 'Client Review (In Progress)',
        company: 'Kaveri Botanicals',
        designation: 'Head of Brand & Growth',
        photoUrl: '',
        rating: 5,
        text: 'The performance ad creatives and luxury skincare boxes delivered immediate clarity to our audience. Turnaround on revisions was transparent and structured.',
        category: 'Performance Marketing',
        published: true,
        order: 2,
        isPlaceholder: true
      },
      {
        id: 'test-3',
        clientName: 'Client Review (In Progress)',
        company: 'Nova Nutrition',
        designation: 'Co-Founder',
        photoUrl: '',
        rating: 5,
        text: 'From Amazon A+ content modules to high-retention video reels, having one creative studio partner ensured complete brand cohesion across all sales channels.',
        category: 'Creative Design & E-commerce',
        published: true,
        order: 3,
        isPlaceholder: true
      }
    ],
    mediaLibrary: [
      {
        id: 'media-1',
        name: 'Zenith Cold Pressed Packaging Bottle',
        url: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=80',
        size: 245000,
        mimeType: 'image/jpeg',
        altText: 'Artisanal cold-pressed bottle packaging and brand guidelines',
        focalPoint: 'center',
        fit: 'cover',
        uploadedAt: '2026-10-10T10:00:00.000Z',
        inUseCount: 3
      },
      {
        id: 'media-2',
        name: 'Performance Ad Campaign Analytics & Growth',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        size: 312000,
        mimeType: 'image/jpeg',
        altText: 'Performance ad conversion analytics dashboard and growth curves',
        focalPoint: 'center',
        fit: 'cover',
        uploadedAt: '2026-10-11T12:00:00.000Z',
        inUseCount: 2
      },
      {
        id: 'media-3',
        name: 'Cinematic Studio Reel Camera & Lighting',
        url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
        size: 420000,
        mimeType: 'image/jpeg',
        altText: '4K cinema camera and studio lighting setup for promotional reels',
        focalPoint: 'center',
        fit: 'cover',
        uploadedAt: '2026-10-12T14:30:00.000Z',
        inUseCount: 2
      },
      {
        id: 'media-4',
        name: 'Cost Efficiency & Strategy Blueprint',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        size: 290000,
        mimeType: 'image/jpeg',
        altText: 'Marketing cost optimization and lower CAC growth modeling',
        focalPoint: 'center',
        fit: 'cover',
        uploadedAt: '2026-10-13T09:15:00.000Z',
        inUseCount: 2
      },
      {
        id: 'media-5',
        name: 'Brand Identity Editorial Showcase',
        url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80',
        size: 380000,
        mimeType: 'image/jpeg',
        altText: 'Comprehensive brand direction and packaging design mockup',
        focalPoint: 'center',
        fit: 'cover',
        uploadedAt: '2026-10-14T11:45:00.000Z',
        inUseCount: 4
      },
      {
        id: 'media-6',
        name: 'Amazon A+ Storefront Layouts',
        url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
        size: 340000,
        mimeType: 'image/jpeg',
        altText: 'Digital creative design storefront graphics and lifestyle banners',
        focalPoint: 'center',
        fit: 'cover',
        uploadedAt: '2026-10-15T16:20:00.000Z',
        inUseCount: 2
      }
    ],
    customSections: [
      {
        id: 'sec-standards',
        page: 'about',
        title: 'Built For Real Business Growth',
        subtitle: 'Our Commitments',
        badge: 'Enterprise Quality Standards',
        description: 'From tactile print tolerances to performance creative variation architecture, every asset is rigorously engineered for lasting commercial impact.',
        layout: 'cards',
        order: 1,
        published: true,
        cards: [
          {
            id: 'sc-1',
            title: 'Manufacturer Certified Files',
            subtitle: 'Zero Print Guesswork',
            description: 'Every dieline is built to manufacturer specifications with exact bleed lines, Pantone swatches, and foil/emboss separation plates.',
            badge: 'Print Production'
          },
          {
            id: 'sc-2',
            title: 'Data-Backed Visual Psychology',
            subtitle: 'Tested Ad Variations',
            description: 'Performance ads are designed around high-retention hooks and value proposition hierarchy proven across Meta and Google.',
            badge: 'Conversion Rate'
          },
          {
            id: 'sc-3',
            title: 'Transparent Collaboration',
            subtitle: 'Direct Partner Access',
            description: 'Direct communication with seasoned design leads, milestone-based UPI billing, and complete vector asset ownership upon delivery.',
            badge: 'Client Assurance'
          }
        ]
      }
    ],
    serviceConcepts: [
      {
        id: 'sc-brand-1',
        serviceId: 'branding',
        title: 'Zenith Cold-Pressed Elixirs',
        category: 'Branding & Packaging',
        tagline: 'Artisanal glass bottle packaging, dielines and tactile emboss guidelines.',
        description: 'A botanical wellness beverage requiring luxury retail presence and sustainable packaging. We crafted custom typography, foil-stamp dielines, and certified box specs.',
        image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=80',
        deliverables: ['Custom Typographic Mark', 'Bottle Label Dielines', 'Foil Stamp Specs', 'Retail Box Design'],
        clientName: 'Zenith Organics',
        order: 1,
        published: true,
        featured: true
      },
      {
        id: 'sc-brand-2',
        serviceId: 'branding',
        title: 'Botanica Rituals Skincare',
        category: 'Branding & Packaging',
        tagline: 'Minimalist frosted glass packaging and visual identity system.',
        description: 'Contemporary clean-beauty identity with organic certification iconography and sustainable unboxing touchpoints.',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80',
        deliverables: ['Brand Guidelines', 'Glass Jar Labels', 'Unboxing Tissue & Seal', 'E-commerce Dielines'],
        clientName: 'Botanica Lab',
        order: 2,
        published: true,
        featured: true
      },
      {
        id: 'sc-creative-1',
        serviceId: 'creative',
        title: 'Nova Nutrition Amazon A+ Suite',
        category: 'Creative Design',
        tagline: 'High-converting marketplace A+ modules and 3D product renders.',
        description: 'Structured comparison tables, ingredient transparency callouts, and multi-SKU storefront banners optimized for mobile shoppers.',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
        deliverables: ['Amazon A+ Modules', 'Product Feature Callouts', 'Lifestyle Visual Compositions', '3D Jar Mockups'],
        clientName: 'Nova Nutrition',
        order: 1,
        published: true,
        featured: true
      },
      {
        id: 'sc-creative-2',
        serviceId: 'creative',
        title: 'Aura Editorial Lookbook & Buyer Deck',
        category: 'Creative Design',
        tagline: 'Seasonal print and digital lookbook design for sustainable apparel.',
        description: 'Editorial layout with minimalist typography and tactile paper stock recommendations for wholesale retail partners.',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
        deliverables: ['48-Page Digital Catalog', 'Print Production Specs', 'Social Teaser Collateral', 'Wholesale Buyer Deck'],
        clientName: 'Aura Apparel',
        order: 2,
        published: true,
        featured: true
      },
      {
        id: 'sc-perf-1',
        serviceId: 'performance',
        title: 'Meta & Google Ads Hook Variations',
        category: 'Performance Marketing Creatives',
        tagline: 'Multi-angle static and motion ad creatives engineered to lower CAC.',
        description: 'Testing 20 visual hooks, headline variations, and social proof layouts driving scaled ROAS across competitive direct-to-consumer verticals.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        deliverables: ['15 Static Hook Ads', '6 UGC Overlay Templates', 'Feed & Story Ratios', 'Headline Testing Matrix'],
        clientName: 'Apex Health',
        order: 1,
        published: true,
        featured: true
      },
      {
        id: 'sc-perf-2',
        serviceId: 'performance',
        title: 'Festive Flash Sale Multi-Channel Ads',
        category: 'Performance Marketing Creatives',
        tagline: 'Urgency-driven promotional creatives driving 2.8x benchmark ROAS.',
        description: 'Dynamic countdown visuals, carousel discount cards, and retargeting banner sets designed for rapid festive shopping adoption.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        deliverables: ['Retargeting Display Ads', 'Carousel Card Sequence', 'Offer Badge System', 'Meta Ad Compliance Check'],
        clientName: 'Kaveri Botanicals',
        order: 2,
        published: true,
        featured: true
      },
      {
        id: 'sc-vid-1',
        serviceId: 'video',
        title: 'Cinematic 9:16 Macro Product Reels',
        category: 'Video Production & Editing',
        tagline: 'High-impact product motion reels with kinetic typography.',
        description: 'Dynamic lighting, macro water droplet textures, and synchronized soundtracking built for viral engagement on TikTok, Reels, and Shorts.',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
        deliverables: ['3 Master Short-Form Reels', 'Color Graded 4K Exports', 'Licensed Audio Track', 'Vertical Subtitle Design'],
        clientName: 'Sora Beverage',
        order: 1,
        published: true,
        featured: true
      },
      {
        id: 'sc-vid-2',
        serviceId: 'video',
        title: 'Founder Story Brand Documentary',
        category: 'Video Production & Editing',
        tagline: 'Authentic 90-second brand origin video for website hero and investor pitch.',
        description: 'Studio interview lighting, b-roll product assembly, and orchestral scoring capturing the passion behind ethical craftsmanship.',
        image: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80',
        deliverables: ['90s Master Video', '30s & 15s Cutdowns', 'Website Hero Loop', 'Full Audio Master'],
        clientName: 'Origin Goods',
        order: 2,
        published: true,
        featured: true
      },
      {
        id: 'sc-dig-1',
        serviceId: 'digital',
        title: '30-Day Brand Growth Narrative Calendar',
        category: 'Digital Marketing & Social Media',
        tagline: 'Cohesive content pillars and visual social grids that convert followers.',
        description: 'Strategic mix of educational carousels, customer highlights, and product showcases maintaining unified brand perception.',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
        deliverables: ['Monthly Content Grid', 'Caption Frameworks', 'Canva Brand Templates', 'Hashtag Clusters'],
        clientName: 'Veda Living',
        order: 1,
        published: true,
        featured: true
      }
    ],
    contentVersions: [
      {
        id: 'v-initial-2026',
        timestamp: new Date().toISOString(),
        label: 'Initial Production Release (Verified)',
        siteContent: {
          logoText: 'good folk',
          logoSubtitle: 'Solution',
          heroHeadline: 'We Build Brands That Move Businesses Forward.',
          heroSubheadline: 'We combine strategy, creative design, branding, and digital marketing to help businesses stand out, connect with the right audience, and grow.',
          aboutHeadline: 'Good Ideas Deserve Good Folks.',
          aboutTagline: 'Goodfolk Solution brings strategy, creativity and thoughtful design together to help brands communicate clearly and grow with purpose.',
          aboutStory: 'Goodfolk Solution was built around a simple belief: thoughtful creative work can make a meaningful difference to a business. We bring branding, design and digital communication together to help businesses express their identity and connect with their audience.',
          aboutApproach: 'We begin by understanding the business, the audience and the objective. From there, we develop creative solutions that are relevant, consistent and purposeful.',
          contactEmail: 'akshay@goodfolksolution.in',
          contactPhone: '+91 9817961412',
          contactWhatsapp: '+91 9817961412',
          contactInstagram: 'https://www.instagram.com/goodfolksolution/',
          ctaHeadline: 'Ready to Build Something Great?',
          ctaSubheadline: "Have a project in mind? Let's turn your ideas into impactful creative work.",
          portfolioCategories: ['All', 'Branding', 'Packaging', 'Creative Design', 'E-commerce', 'Performance Marketing', 'Video & Social'],
          primaryColor: '#123578',
          accentColor: '#ED650B',
          backgroundColor: '#FFFFFF',
          ctaAnimationType: 'particles',
          aboutSectionOrder: ['principles', 'capabilities', 'methodology', 'partnerships']
        }
      }
    ]
  };
}

export class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        const initial = getInitialData();

        const siteContentMerged = {
          ...initial.siteContent,
          ...(parsed.siteContent || {})
        };
        // Critical Requirement: Mobile number must be 0000000
        siteContentMerged.contactPhone = '0000000';
        if (!siteContentMerged.functionalPhoneDestination) {
          siteContentMerged.functionalPhoneDestination = '+91 9817961412';
        }
        if (!siteContentMerged.contactWhatsapp) {
          siteContentMerged.contactWhatsapp = '+91 9817961412';
        }

        // Enforce approved brand palette
        if (!siteContentMerged.primaryColor || siteContentMerged.primaryColor === '#123578') {
          siteContentMerged.primaryColor = '#173B75';
        }
        if (!siteContentMerged.accentColor || siteContentMerged.accentColor === '#ED650B') {
          siteContentMerged.accentColor = '#F07822';
        }
        if (!siteContentMerged.backgroundColor || siteContentMerged.backgroundColor === '#FFFFFF' || siteContentMerged.backgroundColor === '#F7F7F5') {
          siteContentMerged.backgroundColor = '#FFF9F1';
        }
        siteContentMerged.brightBlueColor = '#2458A6';
        siteContentMerged.charcoalColor = '#252A34';
        siteContentMerged.brandProportions = {
          navy: 35,
          softCream: 30,
          warmOrange: 15,
          brightBlue: 12,
          charcoal: 8
        };

        if (!siteContentMerged.websiteImages || siteContentMerged.websiteImages.length === 0) {
          siteContentMerged.websiteImages = initial.siteContent.websiteImages;
        }
        if (!siteContentMerged.services || siteContentMerged.services.length === 0) {
          siteContentMerged.services = initial.siteContent.services;
        }
        if (!siteContentMerged.processSteps || siteContentMerged.processSteps.length === 0) {
          siteContentMerged.processSteps = initial.siteContent.processSteps;
        }
        if (!siteContentMerged.heroSlides || siteContentMerged.heroSlides.length === 0) {
          siteContentMerged.heroSlides = initial.siteContent.heroSlides;
        }
        if (!siteContentMerged.ctaAnimationType) {
          siteContentMerged.ctaAnimationType = 'particles';
        }
        if (!siteContentMerged.aboutSectionOrder || siteContentMerged.aboutSectionOrder.length === 0) {
          siteContentMerged.aboutSectionOrder = ['principles', 'capabilities', 'methodology', 'partnerships'];
        }
        if (!siteContentMerged.servicesBanner) {
          siteContentMerged.servicesBanner = initial.siteContent.servicesBanner;
        }

        // Gracefully merge with initial schema in case CMS fields don't exist yet
        this.data = {
          ...initial,
          ...parsed,
          siteContent: siteContentMerged,
          portfolioProjects: (() => {
            const existing = parsed.portfolioProjects || [];
            const existingIds = new Set(existing.map((p: any) => p.id));
            const missing = initial.portfolioProjects.filter(p => !existingIds.has(p.id));
            return [...existing, ...missing];
          })(),
          trustedBrands: (parsed.trustedBrands && parsed.trustedBrands.length > 0)
            ? parsed.trustedBrands
            : initial.trustedBrands,
          testimonials: (parsed.testimonials && parsed.testimonials.length > 0)
            ? parsed.testimonials
            : initial.testimonials,
          mediaLibrary: (parsed.mediaLibrary && parsed.mediaLibrary.length > 0)
            ? parsed.mediaLibrary
            : initial.mediaLibrary,
          customSections: (parsed.customSections && parsed.customSections.length > 0)
            ? parsed.customSections
            : initial.customSections,
          serviceConcepts: (parsed.serviceConcepts && parsed.serviceConcepts.length > 0)
            ? parsed.serviceConcepts
            : initial.serviceConcepts,
          contentVersions: (parsed.contentVersions && parsed.contentVersions.length > 0)
            ? parsed.contentVersions
            : initial.contentVersions
        };

        // Fix broken image if old 404 URL is still present
        this.data.portfolioProjects.forEach(p => {
          if (p.id === 'zenith-botanicals' && p.image.includes('photo-1622484216851')) {
            p.image = 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80';
          }
        });

        this.save();
      } catch (err) {
        console.error('Error reading database, creating new data file', err);
        this.data = getInitialData();
        this.save();
      }
    } else {
      this.data = getInitialData();
      this.save();
    }
  }

  private save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file', err);
    }
  }

  // Owner & Auth
  getOwner() {
    return this.data.owner;
  }

  updateOwner(update: Partial<DatabaseSchema['owner']>) {
    this.data.owner = { ...this.data.owner, ...update };
    this.save();
    return this.data.owner;
  }

  createSession(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    this.data.sessions[token] = { userId, expiresAt };
    this.save();
    return token;
  }

  verifySession(token: string): boolean {
    if (!token || !this.data.sessions[token]) return false;
    const session = this.data.sessions[token];
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.save();
      return false;
    }
    return true;
  }

  deleteSession(token: string): void {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.save();
    }
  }

  // Enquiries
  getEnquiries(): Enquiry[] {
    return [...this.data.enquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
    const id = `ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnquiry: Enquiry = {
      ...enquiry,
      id,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    this.data.enquiries.unshift(newEnquiry);
    this.save();
    return newEnquiry;
  }

  updateEnquiry(id: string, updates: Partial<Enquiry>): Enquiry | null {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.enquiries[idx] = { ...this.data.enquiries[idx], ...updates };
    this.save();
    return this.data.enquiries[idx];
  }

  deleteEnquiry(id: string): boolean {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.enquiries.splice(idx, 1);
    this.save();
    return true;
  }

  // Projects
  getProjects(): Project[] {
    return [...this.data.projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getProjectById(id: string): Project | null {
    return this.data.projects.find(p => p.id === id) || null;
  }

  getProjectByToken(token: string): Project | null {
    return this.data.projects.find(p => p.clientPaymentToken === token || p.id === token) || null;
  }

  createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'clientPaymentToken'>): Project {
    const id = `GF-PRJ-2026-${String(this.data.projects.length + 1).padStart(2, '0')}`;
    const clientPaymentToken = crypto.randomBytes(8).toString('hex');
    const newProject: Project = {
      ...projectData,
      id,
      clientPaymentToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.projects.unshift(newProject);
    this.save();
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = {
      ...this.data.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.projects[idx];
  }

  deleteProject(id: string): boolean {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.projects.splice(idx, 1);
    this.save();
    return true;
  }

  // Payments
  getPayments(projectId?: string): PaymentTransaction[] {
    let list = this.data.payments;
    if (projectId) {
      list = list.filter(p => p.projectId === projectId);
    }
    return [...list].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }

  getPaymentById(id: string): PaymentTransaction | null {
    return this.data.payments.find(p => p.id === id) || null;
  }

  submitPayment(paymentData: { projectId: string; amount: number; utr: string; clientName: string; notes?: string }): { success: boolean; payment?: PaymentTransaction; error?: string } {
    const existing = this.data.payments.find(p => p.utr.trim().toLowerCase() === paymentData.utr.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'A transaction with this UTR reference has already been recorded.' };
    }

    const id = `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: PaymentTransaction = {
      id,
      projectId: paymentData.projectId,
      clientName: paymentData.clientName,
      amount: Number(paymentData.amount),
      utr: paymentData.utr.trim(),
      upiId: '9817961412@ibl',
      paymentDate: new Date().toISOString(),
      status: 'Pending Verification',
      notes: paymentData.notes,
      createdAt: new Date().toISOString()
    };

    this.data.payments.unshift(newPayment);
    this.save();
    return { success: true, payment: newPayment };
  }

  verifyPayment(paymentId: string, verifiedBy: string = 'Akshay'): { success: boolean; payment?: PaymentTransaction; receipt?: Receipt; error?: string } {
    const payment = this.data.payments.find(p => p.id === paymentId);
    if (!payment) return { success: false, error: 'Payment not found' };
    if (payment.status === 'Verified') return { success: false, error: 'Payment is already verified' };

    payment.status = 'Verified';
    payment.verifiedAt = new Date().toISOString();
    payment.verifiedBy = verifiedBy;

    const project = this.getProjectById(payment.projectId);
    const agreedAmount = project ? project.agreedAmount : payment.amount;

    const verifiedPayments = this.data.payments.filter(p => p.projectId === payment.projectId && p.status === 'Verified');
    const totalVerifiedPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = Math.max(0, agreedAmount - totalVerifiedPaid);
    const isFinalReceipt = remainingBalance === 0;

    const receiptId = `REC-2026-${String(this.data.receipts.length + 1).padStart(2, '0')}`;
    const invoice = this.data.invoices.find(inv => inv.projectId === payment.projectId);

    const receipt: Receipt = {
      id: receiptId,
      paymentId: payment.id,
      projectId: payment.projectId,
      invoiceId: invoice?.id,
      clientName: payment.clientName,
      amountReceived: payment.amount,
      utr: payment.utr,
      verifiedDate: payment.verifiedAt,
      agreedProjectAmount: agreedAmount,
      totalVerifiedPaid,
      remainingBalance,
      isFinalReceipt,
      createdAt: new Date().toISOString()
    };

    payment.receiptId = receiptId;
    this.data.receipts.unshift(receipt);

    if (project && remainingBalance === 0) {
      this.updateProject(project.id, { status: project.status === 'Discovery' ? 'In Progress' : project.status });
    }

    this.save();
    return { success: true, payment, receipt };
  }

  rejectPayment(paymentId: string, reason: string): { success: boolean; payment?: PaymentTransaction; error?: string } {
    const payment = this.data.payments.find(p => p.id === paymentId);
    if (!payment) return { success: false, error: 'Payment not found' };

    payment.status = 'Rejected';
    payment.rejectionReason = reason;
    this.save();
    return { success: true, payment };
  }

  // Invoices & Receipts
  getInvoices(): Invoice[] {
    return [...this.data.invoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt'>): Invoice {
    const id = `INV-2026-${String(this.data.invoices.length + 1).padStart(2, '0')}`;
    const newInvoice: Invoice = {
      ...invoiceData,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.invoices.unshift(newInvoice);
    this.save();
    return newInvoice;
  }

  getReceipts(): Receipt[] {
    return [...this.data.receipts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Dashboard Stats
  getStats(): AdminStats {
    const totalEnquiries = this.data.enquiries.length;
    const newEnquiries = this.data.enquiries.filter(e => e.status === 'New').length;
    const activeProjects = this.data.projects.filter(p => p.status === 'In Progress' || p.status === 'Discovery' || p.status === 'Review & Revisions').length;
    const completedProjects = this.data.projects.filter(p => p.status === 'Completed').length;

    const verifiedPayments = this.data.payments.filter(p => p.status === 'Verified');
    const totalPaymentsReceived = verifiedPayments.reduce((acc, p) => acc + p.amount, 0);

    const totalAgreed = this.data.projects.reduce((acc, p) => acc + p.agreedAmount, 0);
    const outstandingBalances = Math.max(0, totalAgreed - totalPaymentsReceived);

    const pendingVerificationCount = this.data.payments.filter(p => p.status === 'Pending Verification').length;

    const recentActivity: AdminStats['recentActivity'] = [];

    this.data.enquiries.slice(0, 5).forEach(e => {
      recentActivity.push({
        id: e.id,
        type: 'enquiry',
        description: `New enquiry from ${e.name} (${e.company}) for ${e.service}`,
        timestamp: e.createdAt,
        status: e.status
      });
    });

    this.data.payments.slice(0, 5).forEach(p => {
      recentActivity.push({
        id: p.id,
        type: 'payment',
        description: `Payment of ₹${p.amount.toLocaleString('en-IN')} (${p.status}) from ${p.clientName} - UTR: ${p.utr}`,
        timestamp: p.paymentDate,
        status: p.status
      });
    });

    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      totalEnquiries,
      newEnquiries,
      activeProjects,
      completedProjects,
      totalPaymentsReceived,
      outstandingBalances,
      pendingVerificationCount,
      recentActivity: recentActivity.slice(0, 8)
    };
  }

  // Client-specific payment view calculations
  getClientPaymentDetails(tokenOrId: string) {
    const project = this.getProjectByToken(tokenOrId);
    if (!project) return null;

    const payments = this.getPayments(project.id);
    const verifiedPayments = payments.filter(p => p.status === 'Verified');
    const totalVerifiedReceived = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = Math.max(0, project.agreedAmount - totalVerifiedReceived);
    const pendingPayments = payments.filter(p => p.status === 'Pending Verification');
    const invoices = this.data.invoices.filter(i => i.projectId === project.id);
    const receipts = this.data.receipts.filter(r => r.projectId === project.id);

    return {
      project: {
        id: project.id,
        clientName: project.clientName,
        projectName: project.projectName,
        services: project.services,
        agreedAmount: project.agreedAmount,
        startDate: project.startDate,
        deadline: project.deadline,
        status: project.status
      },
      upiId: '9817961412@ibl',
      totalVerifiedReceived,
      remainingBalance,
      hasPendingVerification: pendingPayments.length > 0,
      payments: payments.map(p => ({
        id: p.id,
        amount: p.amount,
        utr: p.utr,
        status: p.status,
        paymentDate: p.paymentDate,
        receiptId: p.receiptId
      })),
      invoices,
      receipts
    };
  }

  // -----------------------------------------------------------
  // CMS Content Management Methods
  // -----------------------------------------------------------

  getSiteContent(): CMSSiteContent {
    return this.data.siteContent;
  }

  updateSiteContent(updates: Partial<CMSSiteContent>): CMSSiteContent {
    this.data.siteContent = { ...this.data.siteContent, ...updates };
    this.save();
    return this.data.siteContent;
  }

  // Portfolio CMS
  getPortfolioProjects(publishedOnly: boolean = false): CMSPortfolioItem[] {
    let list = this.data.portfolioProjects || [];
    if (publishedOnly) {
      list = list.filter(p => p.published);
    }
    return [...list].sort((a, b) => a.order - b.order);
  }

  addPortfolioProject(item: Omit<CMSPortfolioItem, 'id' | 'createdAt' | 'updatedAt'>): CMSPortfolioItem {
    const id = `prj-${Date.now()}`;
    const newProject: CMSPortfolioItem = {
      ...item,
      id,
      order: this.data.portfolioProjects.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.portfolioProjects.push(newProject);
    this.save();
    return newProject;
  }

  updatePortfolioProject(id: string, updates: Partial<CMSPortfolioItem>): CMSPortfolioItem | null {
    const idx = this.data.portfolioProjects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.portfolioProjects[idx] = {
      ...this.data.portfolioProjects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.portfolioProjects[idx];
  }

  deletePortfolioProject(id: string): boolean {
    const idx = this.data.portfolioProjects.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.portfolioProjects.splice(idx, 1);
    this.save();
    return true;
  }

  reorderPortfolioProjects(orderedIds: string[]): CMSPortfolioItem[] {
    orderedIds.forEach((id, index) => {
      const proj = this.data.portfolioProjects.find(p => p.id === id);
      if (proj) {
        proj.order = index + 1;
      }
    });
    this.save();
    return this.getPortfolioProjects();
  }

  addPortfolioCategory(category: string): string[] {
    const clean = category.trim();
    if (!this.data.siteContent.portfolioCategories.includes(clean)) {
      this.data.siteContent.portfolioCategories.push(clean);
      this.save();
    }
    return this.data.siteContent.portfolioCategories;
  }

  // Trusted Brands CMS
  getTrustedBrands(activeOnly: boolean = false): CMSTrustedBrand[] {
    let list = this.data.trustedBrands || [];
    if (activeOnly) {
      list = list.filter(b => b.active);
    }
    return [...list].sort((a, b) => a.order - b.order);
  }

  updateTrustedBrands(brands: CMSTrustedBrand[]): CMSTrustedBrand[] {
    this.data.trustedBrands = brands;
    this.save();
    return this.data.trustedBrands;
  }

  addTrustedBrand(name: string, logoUrl?: string): CMSTrustedBrand {
    const newBrand: CMSTrustedBrand = {
      id: `tb-${Date.now()}`,
      name: name.trim(),
      logoUrl: logoUrl || '',
      order: this.data.trustedBrands.length + 1,
      active: true
    };
    this.data.trustedBrands.push(newBrand);
    this.save();
    return newBrand;
  }

  // Testimonials CMS
  getTestimonials(publishedOnly: boolean = false): CMSTestimonial[] {
    let list = this.data.testimonials || [];
    if (publishedOnly) {
      list = list.filter(t => t.published);
    }
    return [...list].sort((a, b) => a.order - b.order);
  }

  addTestimonial(item: Omit<CMSTestimonial, 'id' | 'createdAt'>): CMSTestimonial {
    const id = `test-${Date.now()}`;
    const newTestimonial: CMSTestimonial = {
      ...item,
      id,
      order: this.data.testimonials.length + 1,
      createdAt: new Date().toISOString()
    };
    this.data.testimonials.push(newTestimonial);
    this.save();
    return newTestimonial;
  }

  updateTestimonial(id: string, updates: Partial<CMSTestimonial>): CMSTestimonial | null {
    const idx = this.data.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.testimonials[idx] = { ...this.data.testimonials[idx], ...updates };
    this.save();
    return this.data.testimonials[idx];
  }

  deleteTestimonial(id: string): boolean {
    const idx = this.data.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.data.testimonials.splice(idx, 1);
    this.save();
    return true;
  }

  // -----------------------------------------------------------
  // Media Library CMS Methods
  // -----------------------------------------------------------

  getMediaLibrary(): MediaItem[] {
    return this.data.mediaLibrary || [];
  }

  addMediaItem(item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem {
    const id = `media-${Date.now()}`;
    const newItem: MediaItem = {
      ...item,
      id,
      uploadedAt: new Date().toISOString(),
      inUseCount: 0
    };
    if (!this.data.mediaLibrary) this.data.mediaLibrary = [];
    this.data.mediaLibrary.unshift(newItem);
    this.save();
    return newItem;
  }

  updateMediaItem(id: string, updates: Partial<MediaItem>): MediaItem | null {
    if (!this.data.mediaLibrary) return null;
    const idx = this.data.mediaLibrary.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.mediaLibrary[idx] = { ...this.data.mediaLibrary[idx], ...updates };
    this.save();
    return this.data.mediaLibrary[idx];
  }

  deleteMediaItem(id: string): { success: boolean; error?: string } {
    if (!this.data.mediaLibrary) return { success: false, error: 'Media library not initialized' };
    const idx = this.data.mediaLibrary.findIndex(m => m.id === id);
    if (idx === -1) return { success: false, error: 'Asset not found' };

    const item = this.data.mediaLibrary[idx];
    // Check if in use in portfolio, concepts or hero slides
    let inUse = false;
    const itemUrl = item.url;
    if (this.data.siteContent.heroSlides?.some(s => s.imageUrl === itemUrl)) inUse = true;
    if (this.data.portfolioProjects.some(p => p.image === itemUrl)) inUse = true;
    if (this.data.serviceConcepts?.some(c => c.image === itemUrl)) inUse = true;

    if (inUse) {
      return { success: false, error: 'Cannot delete: this creative asset is currently in active use across live sections.' };
    }

    this.data.mediaLibrary.splice(idx, 1);
    this.save();
    return { success: true };
  }

  // -----------------------------------------------------------
  // Custom Sections CMS Methods (Full Dynamic Pages)
  // -----------------------------------------------------------

  getCustomSections(page?: string, serviceSlug?: string, publishedOnly: boolean = false): CMSCustomSection[] {
    let list = this.data.customSections || [];
    if (page && page !== 'all') {
      list = list.filter(s => s.page === page || s.page === 'global');
    }
    if (serviceSlug) {
      list = list.filter(s => !s.serviceSlug || s.serviceSlug === serviceSlug);
    }
    if (publishedOnly) {
      list = list.filter(s => s.published);
    }
    return [...list].sort((a, b) => a.order - b.order);
  }

  addCustomSection(item: Omit<CMSCustomSection, 'id' | 'createdAt' | 'updatedAt'>): CMSCustomSection {
    const id = `sec-${Date.now()}`;
    const newSection: CMSCustomSection = {
      ...item,
      id,
      order: (this.data.customSections?.length || 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!this.data.customSections) this.data.customSections = [];
    this.data.customSections.push(newSection);
    this.save();
    return newSection;
  }

  updateCustomSection(id: string, updates: Partial<CMSCustomSection>): CMSCustomSection | null {
    if (!this.data.customSections) return null;
    const idx = this.data.customSections.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.customSections[idx] = {
      ...this.data.customSections[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.customSections[idx];
  }

  duplicateCustomSection(id: string): CMSCustomSection | null {
    if (!this.data.customSections) return null;
    const original = this.data.customSections.find(s => s.id === id);
    if (!original) return null;

    const duplicated: CMSCustomSection = {
      ...original,
      id: `sec-${Date.now()}`,
      title: `${original.title} (Copy)`,
      order: this.data.customSections.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.customSections.push(duplicated);
    this.save();
    return duplicated;
  }

  deleteCustomSection(id: string): boolean {
    if (!this.data.customSections) return false;
    const idx = this.data.customSections.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.data.customSections.splice(idx, 1);
    this.save();
    return true;
  }

  reorderCustomSections(orderedIds: string[]): CMSCustomSection[] {
    if (!this.data.customSections) return [];
    orderedIds.forEach((id, index) => {
      const sec = this.data.customSections.find(s => s.id === id);
      if (sec) {
        sec.order = index + 1;
      }
    });
    this.save();
    return this.getCustomSections();
  }

  // -----------------------------------------------------------
  // Service Concepts CMS Methods (Per Service)
  // -----------------------------------------------------------

  getServiceConcepts(serviceId?: string, publishedOnly: boolean = false): CMSServiceConcept[] {
    let list = this.data.serviceConcepts || [];
    if (serviceId && serviceId !== 'all') {
      list = list.filter(c => c.serviceId.toLowerCase() === serviceId.toLowerCase());
    }
    if (publishedOnly) {
      list = list.filter(c => c.published);
    }
    return [...list].sort((a, b) => a.order - b.order);
  }

  addServiceConcept(item: Omit<CMSServiceConcept, 'id' | 'createdAt'>): CMSServiceConcept {
    const id = `concept-${Date.now()}`;
    const newConcept: CMSServiceConcept = {
      ...item,
      id,
      order: (this.data.serviceConcepts?.length || 0) + 1,
      createdAt: new Date().toISOString()
    };
    if (!this.data.serviceConcepts) this.data.serviceConcepts = [];
    this.data.serviceConcepts.push(newConcept);
    this.save();
    return newConcept;
  }

  updateServiceConcept(id: string, updates: Partial<CMSServiceConcept>): CMSServiceConcept | null {
    if (!this.data.serviceConcepts) return null;
    const idx = this.data.serviceConcepts.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.serviceConcepts[idx] = { ...this.data.serviceConcepts[idx], ...updates };
    this.save();
    return this.data.serviceConcepts[idx];
  }

  duplicateServiceConcept(id: string): CMSServiceConcept | null {
    if (!this.data.serviceConcepts) return null;
    const original = this.data.serviceConcepts.find(c => c.id === id);
    if (!original) return null;

    const duplicated: CMSServiceConcept = {
      ...original,
      id: `concept-${Date.now()}`,
      title: `${original.title} (Variant)`,
      order: this.data.serviceConcepts.length + 1,
      createdAt: new Date().toISOString()
    };
    this.data.serviceConcepts.push(duplicated);
    this.save();
    return duplicated;
  }

  deleteServiceConcept(id: string): boolean {
    if (!this.data.serviceConcepts) return false;
    const idx = this.data.serviceConcepts.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.data.serviceConcepts.splice(idx, 1);
    this.save();
    return true;
  }

  reorderServiceConcepts(orderedIds: string[]): CMSServiceConcept[] {
    if (!this.data.serviceConcepts) return [];
    orderedIds.forEach((id, index) => {
      const conc = this.data.serviceConcepts.find(c => c.id === id);
      if (conc) {
        conc.order = index + 1;
      }
    });
    this.save();
    return this.getServiceConcepts();
  }

  // -----------------------------------------------------------
  // Drafts, Publishing & Version History
  // -----------------------------------------------------------

  publishSiteContent(content: CMSSiteContent, label?: string): { success: boolean; versionId: string } {
    const versionId = `v-${Date.now()}`;
    const newVersion: CMSContentVersion = {
      id: versionId,
      timestamp: new Date().toISOString(),
      label: label || `Published Update (${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})`,
      siteContent: { ...content, isDraft: false, lastPublishedAt: new Date().toISOString() }
    };

    if (!this.data.contentVersions) this.data.contentVersions = [];
    this.data.contentVersions.unshift(newVersion);
    // Keep max 15 versions
    if (this.data.contentVersions.length > 15) {
      this.data.contentVersions = this.data.contentVersions.slice(0, 15);
    }

    this.data.siteContent = {
      ...content,
      isDraft: false,
      lastPublishedAt: new Date().toISOString()
    };
    this.save();
    return { success: true, versionId };
  }

  saveDraftContent(content: CMSSiteContent): CMSSiteContent {
    this.data.siteContent = {
      ...content,
      isDraft: true
    };
    this.save();
    return this.data.siteContent;
  }

  getContentVersions(): CMSContentVersion[] {
    return this.data.contentVersions || [];
  }

  restoreContentVersion(versionId: string): { success: boolean; siteContent?: CMSSiteContent; error?: string } {
    if (!this.data.contentVersions) return { success: false, error: 'No version history available' };
    const version = this.data.contentVersions.find(v => v.id === versionId);
    if (!version) return { success: false, error: 'Version not found' };

    this.data.siteContent = {
      ...version.siteContent,
      isDraft: false,
      lastPublishedAt: new Date().toISOString()
    };
    this.save();
    return { success: true, siteContent: this.data.siteContent };
  }

  // -----------------------------------------------------------
  // Dedicated Website Images & Banners CMS Methods
  // -----------------------------------------------------------

  getWebsiteImages(): CMSImageSlot[] {
    return this.data.siteContent.websiteImages || [];
  }

  updateWebsiteImage(id: string, updates: Partial<CMSImageSlot>): CMSImageSlot | null {
    if (!this.data.siteContent.websiteImages) {
      this.data.siteContent.websiteImages = [];
    }
    const idx = this.data.siteContent.websiteImages.findIndex(slot => slot.id === id);
    if (idx === -1) return null;

    const currentSlot = this.data.siteContent.websiteImages[idx];
    const previousUrl = updates.currentUrl && updates.currentUrl !== currentSlot.currentUrl
      ? currentSlot.currentUrl
      : currentSlot.previousUrl;

    this.data.siteContent.websiteImages[idx] = {
      ...currentSlot,
      ...updates,
      previousUrl,
      updatedAt: new Date().toISOString()
    };

    // If hero slide or logo slot is updated, keep siteContent in sync
    if (id === 'slot-brand-logo' && updates.currentUrl) {
      this.data.siteContent.logoUrl = updates.currentUrl;
    }

    this.save();
    return this.data.siteContent.websiteImages[idx];
  }

  restoreWebsiteImage(id: string): CMSImageSlot | null {
    if (!this.data.siteContent.websiteImages) return null;
    const idx = this.data.siteContent.websiteImages.findIndex(slot => slot.id === id);
    if (idx === -1) return null;

    const slot = this.data.siteContent.websiteImages[idx];
    if (!slot.previousUrl) return null;

    const oldCurrent = slot.currentUrl;
    slot.currentUrl = slot.previousUrl;
    slot.previousUrl = oldCurrent;
    slot.updatedAt = new Date().toISOString();

    if (id === 'slot-brand-logo') {
      this.data.siteContent.logoUrl = slot.currentUrl;
    }

    this.save();
    return slot;
  }

  // -----------------------------------------------------------
  // Services CMS Methods
  // -----------------------------------------------------------

  getServices(): CMSServiceItem[] {
    return (this.data.siteContent.services || []).sort((a, b) => a.order - b.order);
  }

  updateService(id: string, updates: Partial<CMSServiceItem>): CMSServiceItem | null {
    if (!this.data.siteContent.services) {
      this.data.siteContent.services = [];
    }
    const idx = this.data.siteContent.services.findIndex(s => s.id === id);
    if (idx === -1) return null;

    this.data.siteContent.services[idx] = {
      ...this.data.siteContent.services[idx],
      ...updates
    };
    this.save();
    return this.data.siteContent.services[idx];
  }
}

export const db = new Database();
