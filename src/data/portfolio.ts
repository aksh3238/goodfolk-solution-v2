import { PortfolioItem } from '../components/ProjectDetailModal';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'zenith-botanicals',
    title: 'Zenith Artisanal Elixirs',
    category: 'Packaging',
    tagline: 'Luxury cold-pressed juice packaging, tactile label dielines and brand identity system.',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80',
    isConcept: true,
    brief: 'Create an elevated, shelf-stopping brand presence and sustainable glass packaging suite for a cold-pressed wellness beverage line.',
    approach: 'We developed an editorial typographic language paired with custom botanical emboss accents, earthy gradients, and compliant nutrition dielines ready for offset print.',
    brandStrategy: 'Position Zenith as a restorative daily ritual rather than an industrial juice, focusing on organic clarity, transparent ingredient sourcing, and premium tactile glass packaging.',
    colorPalette: ['#173B75', '#2E6338', '#F5EBE1', '#D4AF37'],
    typographyNotes: 'Primary Heading: Editorial Serif paired with Swiss Neo-grotesque for nutritional tables and regulatory dieline text.',
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
    gallery: [
      { id: 'z1', type: 'image', url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1600&q=80', caption: 'Front Bottle Label Finish in Pantone Green & Foil Stamp', order: 1 },
      { id: 'z2', type: 'image', url: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1600&q=80', caption: 'Full 4-SKU Retail Shelf Lineup & Color Coding', order: 2 }
    ],
    caseStudySections: [
      { id: 'cs-z1', title: 'The Retail Shelf Challenge', content: 'In competitive organic grocery aisles, beverages have under 2.5 seconds to communicate premium value and ingredients before a shopper walks past.', order: 1 },
      { id: 'cs-z2', title: 'Tactile Print Architecture', content: 'Engineered specialized tactile embossing and high-contrast color banding for instant flavor recognition across Turmeric Tonic, Celery Greens, Beet Blood, and Citrus Ginger.', order: 2 }
    ]
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
    brandStrategy: 'Merge botanical purity with clinical dermatologist credibility, ensuring the brand speaks authoritatively to ingredient-conscious skincare enthusiasts.',
    colorPalette: ['#173B75', '#D6A87C', '#F2EFE9', '#3D4550'],
    typographyNotes: 'Custom humanist sans with balanced letterforms and open apertures for calm readability.',
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
    gallery: [
      { id: 'a1', type: 'image', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80', caption: 'Frosted Glass Dropper Bottle with Embossed Label', order: 1 }
    ]
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
    brandStrategy: 'High-energy, premium single-origin coffee with zero sugar for ambitious professionals seeking clean energy without crash.',
    colorPalette: ['#0E1118', '#F07822', '#FFFFFF', '#454C5A'],
    typographyNotes: 'Condensed bold display typeface paired with monospaced data callouts for nitrogen pressure specs.',
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
    }
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
    brandStrategy: 'Showcase immersive sound isolation through high-contrast visual storytelling, before/after noise cancellation hooks, and lifestyle proof.',
    colorPalette: ['#173B75', '#2458A6', '#F07822', '#111827'],
    typographyNotes: 'Inter font with high-contrast text overlays designed for immediate legibility on mobile video feeds.',
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
    }
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
    brandStrategy: 'Celebrates the craftsmanship of third-wave roasting through tactile unbleached paper textures, precise altitude notes, and bean origin transparency.',
    colorPalette: ['#3A241D', '#D97706', '#E5DEC9', '#1E293B'],
    typographyNotes: 'Classic humanist typography paired with functional agricultural lot number stamping.',
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
    }
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
    brandStrategy: 'Elevates sustainable luxury through unhurried pacing, tactile fabric movement, and effortless Mediterranean aesthetics.',
    colorPalette: ['#173B75', '#E6C280', '#F8F6F0', '#4A5568'],
    typographyNotes: 'High-fashion editorial display serif paired with minimalist sans subtitle bars.',
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
    }
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
    }
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
    }
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
    }
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
    }
  }
];
