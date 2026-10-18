import {
  Archive,
  BookOpen,
  Camera,
  FlaskConical,
  Package,
  Palette,
  Repeat,
  Scan,
  Share2,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react"
import type {
  IAIFeature,
  ICommunityCard,
  IFilmLab,
  IFooterSection,
  INavItem,
  IStatMetric,
  IWorkflowStep,
} from "@/types"

export const NAV_ITEMS: INavItem[] = [
  { id: "home", label: "Home", href: "#hero", isActive: true },
  { id: "features", label: "Features", href: "#ai-features" },
  { id: "workflow", label: "Workflow", href: "#workflow" },
  { id: "labs", label: "Film Labs", href: "#film-labs" },
  { id: "community", label: "Community", href: "#community" },
]

export const WORKFLOW_STEPS: IWorkflowStep[] = [
  {
    id: "shoot",
    stepNumber: 1,
    title: "Shoot",
    subtitle: "Capture analog moments",
    description:
      "Load your favorite 35mm or 120 roll and frame memories with authentic physical grain.",
    icon: Camera,
    highlightBadge: "Step 01",
  },
  {
    id: "mail",
    stepNumber: 2,
    title: "Drop-off / Mail",
    subtitle: "Send to verified labs",
    description:
      "Drop rolls off at a partner counter or print prepaid tracked mailer shipping labels.",
    icon: Package,
    highlightBadge: "Step 02",
  },
  {
    id: "develop",
    stepNumber: 3,
    title: "Developing",
    subtitle: "Chemical precision",
    description:
      "Standard C-41, authentic B&W, cinema ECN-2 with remjet removal, and positive E-6.",
    icon: FlaskConical,
    highlightBadge: "Step 03",
  },
  {
    id: "scan",
    stepNumber: 4,
    title: "Scanning",
    subtitle: "Ultra high-resolution",
    description:
      "Noritsu HS-1800 and Fuji Frontier SP-3000 scanner runs with dedicated color curves.",
    icon: Scan,
    highlightBadge: "Step 04",
  },
  {
    id: "ai",
    stepNumber: 5,
    title: "AI Enhancing",
    subtitle: "Smart color & grain preservation",
    description:
      "Emulsion identification, spectral color tuning, and non-destructive scratch retouching.",
    icon: Wand2,
    highlightBadge: "Step 05",
  },
  {
    id: "archive",
    stepNumber: 6,
    title: "Archive & Share",
    subtitle: "Cloud negatives & community",
    description:
      "Perpetual cloud negative vault with EXIF metadata, framing tags, and instant gallery sharing.",
    icon: Archive,
    highlightBadge: "Step 06",
  },
]

export const AI_FEATURES: IAIFeature[] = [
  {
    id: "stock-detection",
    title: "AI Stock Identification",
    subtitle: "Automated Emulsion Recognition",
    description:
      "Detect 200+ historic and modern film stocks automatically by analyzing microscopic grain geometry and dye coupler curves.",
    icon: Camera,
    supportedTags: ["Portra 400", "Fuji 400H", "Ilford HP5+", "Cinestill 800T"],
  },
  {
    id: "color-calibration",
    title: "Color Calibration",
    subtitle: "Laboratory-Grade Profiles",
    description:
      "Eliminate lamp warm-up shifts and exhausted chemistry casts while strictly honoring each stock's true intended color rendition.",
    icon: Palette,
    supportedTags: ["Noritsu Profiles", "Frontier LUTs", "Spectral Matching"],
  },
  {
    id: "grain-restoration",
    title: "AI Grain & Scan Polish",
    subtitle: "Non-Destructive Restoration",
    description:
      "Intelligently sweep away scanner glass dust, base scratches, and water spots without smoothing organic silver halide crystal texture.",
    icon: Sparkles,
    supportedTags: ["True Halide Grain", "Scratch Removal", "Lossless DNG"],
  },
]

export const VERIFIED_FILM_LABS: IFilmLab[] = [
  {
    id: "lab-1",
    name: "Croplab Hanoi",
    city: "Hanoi",
    country: "Vietnam",
    address: "Hoan Kiem District, Hanoi",
    rating: 4.9,
    reviewCount: 312,
    turnaround: "1-2 Days",
    processes: ["Color (C-41)", "B&W", "ECN-2"],
    acceptsMailIn: true,
    featuredBadge: "Top Rated Lab",
  },
  {
    id: "lab-2",
    name: "LLab Saigon",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    address: "District 1, Ho Chi Minh City",
    rating: 4.85,
    reviewCount: 428,
    turnaround: "Same Day",
    processes: ["Color (C-41)", "B&W", "ECN-2", "Slide (E-6)"],
    acceptsMailIn: true,
    featuredBadge: "Rapid Turnaround",
  },
  {
    id: "lab-3",
    name: "Darkroom Tokyo",
    city: "Tokyo",
    country: "Japan",
    address: "Shibuya, Tokyo",
    rating: 4.95,
    reviewCount: 560,
    turnaround: "1-2 Days",
    processes: ["Color (C-41)", "B&W", "Slide (E-6)"],
    acceptsMailIn: true,
    featuredBadge: "Master Frontier Scans",
  },
  {
    id: "lab-4",
    name: "Brooklyn Film Camera Lab",
    city: "New York",
    country: "United States",
    address: "Grand St, Brooklyn, NY",
    rating: 4.88,
    reviewCount: 680,
    turnaround: "3-5 Days",
    processes: ["Color (C-41)", "B&W", "ECN-2"],
    acceptsMailIn: true,
  },
  {
    id: "lab-5",
    name: "Silbersalz35 Lab",
    city: "Stuttgart",
    country: "Germany",
    address: "Baden-Württemberg",
    rating: 4.92,
    reviewCount: 390,
    turnaround: "3-5 Days",
    processes: ["ECN-2", "Color (C-41)"],
    acceptsMailIn: true,
    featuredBadge: "True Cinema ECN-2",
  },
  {
    id: "lab-6",
    name: "Danang Film Space",
    city: "Da Nang",
    country: "Vietnam",
    address: "Hai Chau District, Da Nang",
    rating: 4.79,
    reviewCount: 185,
    turnaround: "1-2 Days",
    processes: ["Color (C-41)", "B&W"],
    acceptsMailIn: true,
  },
]

export const COMMUNITY_FEATURES: ICommunityCard[] = [
  {
    id: "frames",
    title: "Share Your Frames",
    description:
      "Publish completed rolls with EXIF recipes, camera bodies, lenses, and lab notes to your public analog portfolio.",
    icon: Share2,
    tag: "Exhibition",
    actionLabel: "Explore Gallery",
    actionHref: "#gallery",
  },
  {
    id: "gear",
    title: "Gear Trade Hub",
    description:
      "Buy, sell, and swap vintage film bodies, tested mechanical rangefinders, and rare primes with community escrow protection.",
    icon: Repeat,
    tag: "Marketplace",
    actionLabel: "Browse Gear",
    actionHref: "#marketplace",
  },
  {
    id: "reviews",
    title: "Community Lab Reviews",
    description:
      "Real turnaround time verifications, unaltered sample scans, and honest chemical quality ratings by fellow film photographers.",
    icon: Star,
    tag: "Ratings",
    actionLabel: "Read Reviews",
    actionHref: "#reviews",
  },
  {
    id: "knowledge",
    title: "Film Knowledge Base",
    description:
      "Crowdsourced push/pull exposure guides, reciprocity compensation calculators, and DIY chemical brewing formulas.",
    icon: BookOpen,
    tag: "Guides",
    actionLabel: "Read Guides",
    actionHref: "#guides",
  },
]

export const STAT_METRICS: IStatMetric[] = [
  {
    id: "photographers",
    value: "10,000+",
    label: "Film Photographers",
    description: "Active analog shooters globally",
  },
  {
    id: "labs",
    value: "500+",
    label: "Verified Labs",
    description: "Certified partner development labs",
  },
  {
    id: "rolls",
    value: "50,000+",
    label: "Rolls Processed",
    description: "Archived with full metadata",
  },
  {
    id: "satisfaction",
    value: "95%",
    label: "Customer Satisfaction",
    description: "Consistently rated 5-star quality",
  },
]

export const FOOTER_SECTIONS: IFooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Film Roll Vault", href: "#workflow" },
      { label: "AI Scan Suite", href: "#ai-features" },
      { label: "Lab Directory", href: "#film-labs" },
      { label: "Gear Marketplace", href: "#marketplace" },
      { label: "Pricing & Plans", href: "#pricing" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Photographers", href: "#photographers" },
      { label: "For Film Labs", href: "#labs" },
      { label: "For Camera Stores", href: "#stores" },
      { label: "API for Developers", href: "#api" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Film Stock Guide", href: "#guide" },
      { label: "Dev Times Chart", href: "#chart" },
      { label: "Community Blog", href: "#blog" },
      { label: "Knowledge Base", href: "#knowledge" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About FilmLink", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Press & Media", href: "#press" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "Security", href: "#security" },
    ],
  },
]
