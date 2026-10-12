import type React from "react"
import type {
  AIFeatureId,
  CommunityCategory,
  FilmProcessType,
  LabTurnaroundSpeed,
  NavKey,
  SocialPlatform,
  WorkflowStepId,
} from "./landing.types"

/**
 * Pure TypeScript interfaces for FilmLink Landing Page domain objects.
 */

export interface INavItem {
  id: NavKey
  label: string
  href: string
  isActive?: boolean
  badge?: string
}

export interface IHeroAction {
  label: string
  href: string
  variant: "primary" | "secondary"
  icon?: React.ComponentType<{ className?: string }>
}

export interface IWorkflowStep {
  id: WorkflowStepId
  stepNumber: number
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  highlightBadge?: string
}

export interface IAIFeature {
  id: AIFeatureId
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  supportedTags: string[]
  accentColor?: string
}

export interface ILabPriceItem {
  process: string
  price: string
  notes?: string
}

export interface IFilmLab {
  id: string
  name: string
  city: string
  country: string
  address: string
  rating: number
  reviewCount: number
  turnaround: LabTurnaroundSpeed
  processes: FilmProcessType[]
  acceptsMailIn: boolean
  featuredBadge?: string
  avatarUrl?: string
  tagline?: string
  description?: string
  formats?: string[]
  scanners?: string[]
  priceRange?: string
  phone?: string
  email?: string
  website?: string
  instagram?: string
  openingHours?: string
  supportsPushPull?: boolean
  returnsNegatives?: boolean
  sellsFilm?: boolean
  pricingSample?: ILabPriceItem[]
}

export interface ICommunityCard {
  id: CommunityCategory
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  tag: string
  actionLabel: string
  actionHref: string
}

export interface IStatMetric {
  id: string
  value: string
  label: string
  description?: string
  trend?: string
}

export interface IFooterLink {
  label: string
  href: string
  isExternal?: boolean
  badge?: string
}

export interface IFooterSection {
  title: string
  links: IFooterLink[]
}

export interface ISocialLink {
  platform: SocialPlatform
  href: string
  label: string
}

export interface ILabSearchFilters {
  query: string
  process: FilmProcessType
  mailInOnly: boolean
}

export interface ILabSearchState {
  filters: ILabSearchFilters
  filteredLabs: IFilmLab[]
  totalCount: number
  setQuery: (query: string) => void
  setProcess: (process: FilmProcessType) => void
  setMailInOnly: (mailInOnly: boolean) => void
  resetFilters: () => void
}
