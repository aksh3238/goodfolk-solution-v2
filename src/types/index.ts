export type ServiceCategory = 
  | 'Branding & Packaging'
  | 'Creative Design'
  | 'Performance Marketing Creatives'
  | 'Video Production & Editing'
  | 'Digital Marketing & Social Media Management'
  | 'Website & UI/UX Design'
  | 'E-commerce & Marketplace Creative Design'
  | 'Motion Graphics & Animation'
  | 'Print & Marketing Collateral'
  | 'Presentation & Pitch Deck Design'
  | string;

export type EnquiryStatus = 'New' | 'Contacted' | 'Quotation Sent' | 'In Progress' | 'Converted' | 'Completed' | 'Archived';

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  service: ServiceCategory | string;
  budget?: string;
  deadline?: string;
  details: string;
  consent: boolean;
  status: EnquiryStatus;
  internalNotes?: string;
  convertedProjectId?: string;
  createdAt: string;
}

export type ProjectStatus = 'Discovery' | 'In Progress' | 'Review & Revisions' | 'Completed' | 'Archived';
export type ProjectPaymentStatus = 'Unpaid' | 'Partially Paid' | 'Fully Paid';

export interface Project {
  id: string;
  clientName: string;
  contactEmail: string;
  contactPhone: string;
  projectName: string;
  services: string[];
  agreedAmount: number;
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  internalNotes?: string;
  clientPaymentToken: string;
  enquiryId?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentVerificationStatus = 'Pending Verification' | 'Verified' | 'Rejected';

export interface PaymentTransaction {
  id: string;
  projectId: string;
  clientName: string;
  amount: number;
  utr: string;
  upiId: string;
  paymentDate: string;
  status: PaymentVerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
  receiptId?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  clientName: string;
  contactEmail: string;
  contactPhone: string;
  projectName: string;
  amount: number;
  lineItems: Array<{ description: string; amount: number }>;
  issueDate: string;
  dueDate: string;
  status: 'Issued' | 'Partially Paid' | 'Paid' | 'Cancelled';
  notes?: string;
  upiId: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  paymentId: string;
  projectId: string;
  invoiceId?: string;
  clientName: string;
  amountReceived: number;
  utr: string;
  verifiedDate: string;
  agreedProjectAmount: number;
  totalVerifiedPaid: number;
  remainingBalance: number;
  isFinalReceipt: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin';
}

export interface AdminStats {
  totalEnquiries: number;
  newEnquiries: number;
  activeProjects: number;
  completedProjects: number;
  totalPaymentsReceived: number;
  outstandingBalances: number;
  pendingVerificationCount: number;
  recentActivity: Array<{
    id: string;
    type: 'enquiry' | 'payment' | 'project' | 'receipt';
    description: string;
    timestamp: string;
    status?: string;
  }>;
}

// -------------------------------------------------------------
// CMS Interfaces for Dynamic Content Management
// -------------------------------------------------------------

export interface PortfolioMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  posterUrl?: string;
  caption?: string;
  altText?: string;
  title?: string;
  order: number;
}

export interface CaseStudySection {
  id: string;
  title: string;
  content: string;
  image?: string;
  order: number;
}

export interface CMSPortfolioItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  image: string;
  gallery?: PortfolioMediaItem[];
  videoUrl?: string;
  videoPoster?: string;
  caseStudySections?: CaseStudySection[];
  associatedServices?: string[];
  brandStrategy?: string;
  colorPalette?: string[];
  typographyNotes?: string;
  clientName?: string;
  projectYear?: string;
  isConcept: boolean;
  brief: string;
  approach: string;
  deliverables: string[];
  specs: {
    format: string;
    timeline: string;
    tools: string;
  };
  tags?: string[];
  published: boolean;
  isDraft?: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSTestimonial {
  id: string;
  clientName: string;
  company: string;
  designation?: string;
  photoUrl?: string;
  rating: number; // 1 to 5
  text: string;
  category?: string;
  published: boolean;
  order: number;
  isPlaceholder: boolean;
  createdAt?: string;
}

export interface CMSTrustedBrand {
  id: string;
  name: string;
  logoUrl?: string;
  order: number;
  active: boolean;
}

export interface CMSProcessStep {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  desc: string;
  iconName?: string;
  badge?: string;
}

export interface CMSHeroSlide {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  targetPath: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
  altText?: string;
  focalPoint?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  fit?: 'cover' | 'contain';
  uploadedAt: string;
  inUseCount?: number;
}

export interface CMSSectionCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  badge?: string;
  link?: string;
  ctaText?: string;
}

export interface CMSCustomSection {
  id: string;
  page: 'home' | 'about' | 'services' | 'contact' | 'global';
  serviceSlug?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  layout: 'cards' | 'features' | 'banner' | 'grid' | 'text-split';
  order: number;
  published: boolean;
  cards: CMSSectionCard[];
  bannerImage?: string;
  ctaText?: string;
  ctaLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSServiceConcept {
  id: string;
  serviceId: string; // 'branding' | 'creative' | 'performance' | 'video' | 'digital' | custom
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  deliverables: string[];
  clientName?: string;
  order: number;
  published: boolean;
  featured?: boolean;
  createdAt?: string;
}

export interface CMSImageSlot {
  id: string;
  page: 'home' | 'services' | 'portfolio' | 'about' | 'contact' | 'global' | 'legal';
  section: string;
  title: string;
  currentUrl: string;
  desktopUrl?: string;
  mobileUrl?: string;
  tabletUrl?: string;
  actualDimensions?: string;
  recommendedDimensions: string;
  aspectRatio: string;
  maxSize: string;
  formats: string[];
  focalPoint?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  altText: string;
  previousUrl?: string;
  updatedAt?: string;
}

export interface CMSServiceItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  bannerImage?: string;
  deliverables: string[];
  keyHighlights: string[];
  ctaText?: string;
  ctaDestination?: string;
  order: number;
  published: boolean;
}

export interface CMSContentVersion {
  id: string;
  timestamp: string;
  label: string;
  siteContent: CMSSiteContent;
}

export interface CMSSiteContent {
  logoUrl?: string;
  logoText: string;
  logoSubtitle: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutHeadline: string;
  aboutTagline: string;
  aboutStory: string;
  aboutApproach: string;
  contactEmail: string;
  contactPhone: string; // The displayed mobile number: 0000000
  functionalPhoneDestination?: string; // The functional dialer/whatsapp destination: +91 9817961412
  contactWhatsapp: string;
  contactInstagram: string;
  ctaHeadline: string;
  ctaSubheadline: string;
  portfolioCategories: string[];
  processSteps?: CMSProcessStep[];
  heroSlides?: CMSHeroSlide[];
  websiteImages?: CMSImageSlot[];
  services?: CMSServiceItem[];
  // Hero Brand Video (15-second cinematic brand film)
  heroVideoUrl?: string;
  heroVideoPoster?: string;
  heroVideoEnabled?: boolean;
  heroVideoHeading?: string;
  // Visual & Brand Customizations
  primaryColor?: string; // #173B75
  brightBlueColor?: string; // #2458A6
  accentColor?: string; // #F07822
  backgroundColor?: string; // #FFF9F1
  charcoalColor?: string; // #252A34
  brandProportions?: {
    navy: number;
    softCream: number;
    warmOrange: number;
    brightBlue: number;
    charcoal: number;
  };
  ctaAnimationType?: 'particles' | 'none';
  aboutSectionOrder?: string[];
  // Services Page Creative Banner (Editable from Admin Console)
  servicesBanner?: CMSServicesBanner;
  // Drafts & Versioning
  isDraft?: boolean;
  lastPublishedAt?: string;
}

export interface CMSServicesBanner {
  enabled: boolean;
  imageUrl?: string;
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaDestination?: string;
  focalPoint?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  badge?: string;
  isDraft?: boolean;
  updatedAt?: string;
}

