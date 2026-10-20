export interface ServiceItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  deliverables: string[];
  keyHighlights: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'branding',
    slug: 'branding-and-packaging',
    number: '01',
    title: 'Branding & Packaging',
    shortDesc: 'Brand identity, logo systems, packaging design and brand guidelines.',
    fullDesc: 'We craft comprehensive visual identity systems and tangible packaging that stand out on retail shelves and digital touchpoints. Every element is engineered to communicate your core values, evoke emotion, and build enduring brand equity.',
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
    ]
  },
  {
    id: 'creative',
    slug: 'creative-design',
    number: '02',
    title: 'Creative Design',
    shortDesc: 'Social media creatives, advertising graphics, website assets and marketing collateral.',
    fullDesc: 'From high-converting advertising collateral to scroll-stopping social visuals, we create purposeful digital and graphic design assets that elevate your brand perception and engage your target audience across all communication channels.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Social media creatives and campaign assets',
      'Digital advertising graphics and display banners',
      'Website visual assets and promotional graphics',
      'Branded marketing collateral and presentation graphics',
      'Custom vector illustrations and branded infographics',
      'Multi-format creative suites for cross-platform publishing'
    ],
    keyHighlights: [
      'Thumb-stopping visual hierarchy engineered for digital feeds',
      'Multi-format export optimized for web speed and high-DPI screens',
      'Unified aesthetic across all brand customer touchpoints'
    ]
  },
  {
    id: 'performance',
    slug: 'performance-marketing-creatives',
    number: '03',
    title: 'Performance Marketing Creatives',
    shortDesc: 'Paid advertising visuals, campaign creatives, creative variations and conversion-focused design.',
    fullDesc: 'Creative is the number one lever for paid acquisition. We develop ad creatives specifically engineered to stop the scroll, clarify the value proposition within 3 seconds, and trigger profitable action across Meta, Google, TikTok, and digital display networks.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Paid advertising visuals (static ads, carousels, video overlays)',
      'High-impact campaign creatives with modular hook variations',
      'A/B testing creative variations to lower customer acquisition cost (CAC)',
      'Conversion-focused design tailored to Meta and Google performance algorithms',
      'Multi-ratio adaptations (9:16 Stories/Reels, 4:5 Feeds, 1:1 Displays)',
      'Seasonal promotional and festive campaign creative suites'
    ],
    keyHighlights: [
      'Framework-driven hook and headline variations',
      'Direct-response visual psychology applied to each asset',
      'Rapid iteration based on campaign performance metrics'
    ]
  },
  {
    id: 'video',
    slug: 'video-production-and-editing',
    number: '04',
    title: 'Video Production & Editing',
    shortDesc: 'Product videos, promotional videos, reels, short-form content and motion graphics.',
    fullDesc: 'Video is the most powerful medium for brand storytelling and engagement. We shoot, edit, color grade, and polish promotional videos, commercial reels, and product demonstrations that captivate audiences and inspire buyer confidence.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Product videos and commercial brand films',
      'Promotional videos tailored for launches and campaigns',
      'Short-form reels, TikToks, and YouTube Shorts',
      'Video editing, sound design, and color grading',
      'Kinetic motion typography, 2D animation and logo stingers',
      'Campaign video adaptations across all social aspect ratios'
    ],
    keyHighlights: [
      'Paced for short attention spans with dynamic motion retention hooks',
      'Studio-grade sound mixing and licensed commercial soundtracking',
      'Platform-native subtitle styling and high-retention editing'
    ]
  },
  {
    id: 'digital',
    slug: 'digital-marketing-and-social-media',
    number: '05',
    title: 'Digital Marketing & Social Media Management',
    shortDesc: 'Social media strategy, content calendars, creative publishing and campaign coordination.',
    fullDesc: 'We manage your brand presence with structured content planning, strategic narrative building, and proactive community engagement. Transform your social channels from passive profiles into authoritative growth engines.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Social media strategy and channel management',
      'Monthly strategic content calendars and creative visual roadmaps',
      'Creative publishing, copywriting and caption frameworks',
      'Campaign execution and coordination across platforms',
      'Community engagement strategies and hashtag optimization',
      'Monthly performance analysis and creative optimization reports'
    ],
    keyHighlights: [
      'Consistent publishing schedule and premium visual aesthetic',
      'Cross-channel cohesive brand voice and messaging',
      'Data-driven insights to refine future creative strategy'
    ]
  },
  {
    id: 'uiux',
    slug: 'website-and-uiux-design',
    number: '06',
    title: 'Website & UI/UX Design',
    shortDesc: 'Website interfaces, landing pages, user journeys, responsive layouts and digital experiences.',
    fullDesc: 'We design intuitive, conversion-focused websites and digital product interfaces. From wireframing frictionless user journeys to responsive design systems, we build digital experiences that turn visitors into loyal customers.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Website interfaces and landing page design',
      'User journey mapping, wireframing and interactive prototypes',
      'Mobile-responsive layouts optimized for speed and conversion',
      'Component design systems and UI style guides in Figma',
      'E-commerce storefront UI and checkout experience optimization',
      'Design handoff specifications ready for development'
    ],
    keyHighlights: [
      'Frictionless user experience engineered for business conversion',
      'Design systems built with reusable components and tokens',
      'Thorough testing across desktop, tablet and mobile viewports'
    ]
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce-and-marketplace-creative',
    number: '07',
    title: 'E-commerce & Marketplace Creative Design',
    shortDesc: 'Amazon A+ Content, product listing images, storefront graphics, product infographics and e-commerce banners.',
    fullDesc: 'In crowded online marketplaces, standout imagery is the primary sales driver. We design high-converting Amazon A+ Content, keyword-aligned listing image stacks, branded storefronts, and product feature infographics that build immediate buyer trust and multiply conversion rates.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Amazon A+ Enhanced Brand Content modules & brand stories',
      '7-image listing stack (hero, benefits, scale, lifestyle, comparison chart)',
      'Custom marketplace storefront banner graphics and navigation tiles',
      'Feature callout infographics and technical specification graphics',
      'Shopify, Flipkart, and Quick-Commerce banner suites',
      'Product 3D packaging renders and digital photorealistic mockups'
    ],
    keyHighlights: [
      'Engineered to improve click-through-rate (CTR) and conversion rate (CVR)',
      'Strict adherence to Amazon and marketplace image guidelines',
      'Visual objection handling integrated directly into the image carousel'
    ]
  },
  {
    id: 'motion',
    slug: 'motion-graphics-and-animation',
    number: '08',
    title: 'Motion Graphics & Animation',
    shortDesc: 'Animated advertisements, logo animations, kinetic typography, promotional motion graphics and social media animations.',
    fullDesc: 'Bring your brand to life with dynamic motion design. We create animated advertisements, polished logo reveals, kinetic typographic messaging, and engaging social motion graphics that hold viewer attention in fast-scrolling environments.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Animated digital advertisements for paid media campaigns',
      'Signature brand logo animations and video intro/outro stingers',
      'Kinetic typography sequences for product storytelling',
      'Promotional motion graphics and UI interaction showcases',
      'Micro-animations and animated icon sets for websites and apps',
      'Lottie, GIF, and MP4 animated deliverables for all platforms'
    ],
    keyHighlights: [
      'Fluid 60fps animations crafted with precise easing curves',
      'Optimized file sizes for rapid loading in web and mobile environments',
      'Seamless brand consistency matching your typography and colors'
    ]
  },
  {
    id: 'print',
    slug: 'print-and-marketing-collateral',
    number: '09',
    title: 'Print & Marketing Collateral',
    shortDesc: 'Brochures, catalogues, business stationery, flyers, posters, event graphics and print-ready artwork.',
    fullDesc: 'Tangible physical collateral creates lasting real-world brand impressions. We design exquisite brochures, comprehensive product catalogues, premium stationery suites, exhibition event booths, and promotional posters with zero print-tolerance guesswork.',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Corporate brochures, company profiles, and product catalogues',
      'Premium business stationery (business cards, letterheads, presentation folders)',
      'Flyers, promotional leaflets, and direct mailers',
      'Event graphics, exhibition trade-show booths, and rollup pull-up banners',
      'Retail posters, point-of-sale (POS) materials, and window decals',
      'Manufacturer-certified print-ready PDF artwork with bleed and Pantone specs'
    ],
    keyHighlights: [
      'Rigorous CMYK color separations and Pantone spot color matching',
      'Finishing specifications (matte/gloss lamination, spot UV, embossing, foils)',
      'Zero production guesswork for printers and fabrication teams'
    ]
  },
  {
    id: 'presentation',
    slug: 'presentation-and-pitch-deck-design',
    number: '10',
    title: 'Presentation & Pitch Deck Design',
    shortDesc: 'Business presentations, sales decks, company profiles, investor pitch decks and branded presentation systems.',
    fullDesc: 'Winning pitches require both clarity of thought and stunning visual craft. We design persuasive investor pitch decks, high-stakes enterprise sales presentations, and company profile decks that command executive attention and close high-value deals.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Investor pitch decks for seed, Series A/B, and growth funding rounds',
      'Enterprise sales decks and product capability presentations',
      'Company profile credentials and annual report presentations',
      'Modular master slide templates in PowerPoint, Keynote, and Google Slides',
      'Custom data visualization, bespoke financial charts, and process diagrams',
      'Presenter-ready guidelines and editable vector asset kits'
    ],
    keyHighlights: [
      'Compelling narrative arc and executive-level visual hierarchy',
      'Complex data translated into intuitive visual charts and frameworks',
      'Fully editable master slides with branded fonts and color themes'
    ]
  }
];
