export interface SearchSuggestionItem {
  id: string
  label: string
  category: "film-stock" | "camera" | "process" | "city" | "lab"
  badge?: string
}

export const MOCK_SEARCH_CHIPS: string[] = [
  "All Labs",
  "Hanoi",
  "Ho Chi Minh City",
  "Color (C-41)",
  "ECN-2",
  "B&W",
  "Slide (E-6)",
  "Same Day",
  "Da Nang",
  "Kodak Portra 400",
  "Cinestill 800T",
  "Ilford HP5 Plus",
]

export const MOCK_STRUCTURED_SUGGESTIONS: SearchSuggestionItem[] = [
  { id: "s-1", label: "Croplab Hanoi", category: "lab", badge: "Hanoi" },
  { id: "s-2", label: "LLab Saigon", category: "lab", badge: "Saigon" },
  { id: "s-3", label: "Danang Film Space", category: "lab", badge: "Da Nang" },
  { id: "s-4", label: "Color (C-41)", category: "process", badge: "Popular" },
  { id: "s-5", label: "ECN-2 Cinema", category: "process", badge: "Cinema" },
  { id: "s-6", label: "B&W Hand-dev", category: "process" },
  { id: "s-7", label: "Kodak Portra 400", category: "film-stock", badge: "Color Negative" },
  { id: "s-8", label: "Cinestill 800T", category: "film-stock", badge: "Tungsten" },
  { id: "s-9", label: "Ilford HP5 Plus", category: "film-stock", badge: "Black & White" },
  { id: "s-10", label: "Leica M6", category: "camera", badge: "Rangefinder" },
  { id: "s-11", label: "Olympus OM-1", category: "camera", badge: "SLR" },
  { id: "s-12", label: "Canon AE-1", category: "camera", badge: "SLR" },
]
