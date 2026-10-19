export interface CurrentUserProfile {
  id: string
  name: string
  username: string
  avatarUrl: string
  role: "user" | "creator" | "lab-owner"
  bio: string
  location: string
  cameras: string[]
  favoriteFilm: string
  ordersCount: number
  postsCount: number
}

export const MOCK_CURRENT_USER: CurrentUserProfile = {
  id: "user-current",
  name: "Nguyen Hoang",
  username: "hoang_film",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  role: "user",
  bio: "Analog photography lover | 35mm & 120 formats | Hanoi",
  location: "Hanoi, Vietnam",
  cameras: ["Olympus OM-1", "Canon AE-1 Program"],
  favoriteFilm: "Kodak Portra 400",
  ordersCount: 8,
  postsCount: 14,
}
