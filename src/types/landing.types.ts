/**
 * Pure TypeScript types for the FilmLink Landing Page.
 * Contains type aliases, union types, and utility types.
 */

export type NavKey = "home" | "features" | "workflow" | "labs" | "community"

export type FilmProcessType =
  | "All"
  | "Color (C-41)"
  | "B&W"
  | "ECN-2"
  | "Slide (E-6)"

export type WorkflowStepId =
  | "shoot"
  | "mail"
  | "develop"
  | "scan"
  | "ai"
  | "archive"

export type AIFeatureId =
  | "stock-detection"
  | "color-calibration"
  | "grain-restoration"

export type CommunityCategory =
  | "frames"
  | "gear"
  | "reviews"
  | "knowledge"

export type LabTurnaroundSpeed = "Same Day" | "1-2 Days" | "3-5 Days" | "1 Week"

export type SocialPlatform = "instagram" | "twitter" | "discord" | "github"
