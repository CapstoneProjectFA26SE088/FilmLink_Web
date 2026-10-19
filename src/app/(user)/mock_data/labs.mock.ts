import type { FilmProcessType, LabTurnaroundSpeed } from "@/types"

export interface LabPricingItem {
  name: string
  format: string
  process: FilmProcessType
  priceVnd: number
  priceFormatted: string
  turnaround: string
  notes?: string
}

export interface LabScannerInfo {
  name: string
  type: string
  maxResolution: string
  colorProfile: string
  description: string
}

export interface LabReview {
  id: string
  author: string
  rating: number
  date: string
  comment: string
  scannedWith?: string
}

export interface DetailedFilmLab {
  id: string
  name: string
  city: string
  country: string
  address: string
  phone: string
  email: string
  openingHours: string
  rating: number
  reviewCount: number
  turnaround: LabTurnaroundSpeed
  processes: FilmProcessType[]
  acceptsMailIn: boolean
  featuredBadge?: string
  avatarUrl?: string
  description: string
  scanners: LabScannerInfo[]
  pricing: LabPricingItem[]
  reviewsList: LabReview[]
}

export const MOCK_FILM_LABS: DetailedFilmLab[] = [
  {
    id: "lab-1",
    name: "Croplab Hanoi",
    city: "Hanoi",
    country: "Vietnam",
    address: "Hoan Kiem District, Hanoi",
    phone: "0982 123 456",
    email: "contact@croplabhanoi.vn",
    openingHours: "09:00 - 20:00 (Mon - Sun)",
    rating: 4.9,
    reviewCount: 312,
    turnaround: "1-2 Days",
    processes: ["Color (C-41)", "B&W", "ECN-2"],
    acceptsMailIn: true,
    featuredBadge: "Top Rated Lab",
    description: "Lab tráng scan phim chuyên nghiệp hàng đầu Hà Nội. Trang bị hệ thống máy tráng tự động Noritsu và máy scan chuyên dụng độ phân giải cao.",
    scanners: [
      {
        name: "Noritsu HS-1800",
        type: "High-speed CCD Scanner",
        maxResolution: "4000 x 6000 px (24MP)",
        colorProfile: "True Tone Film Color & Clean Blacks",
        description: "Cho độ nét hạt mịn, dynamic range rộng và màu sắc trung thực chuẩn phim.",
      },
      {
        name: "Fuji Frontier SP-3000",
        type: "Japanese Cinema & Portrait Scanner",
        maxResolution: "3000 x 4500 px (14MP)",
        colorProfile: "Pastel Green & Soft Warm Skin Tone",
        description: "Nổi tiếng với tone màu da ấm áp ngọt ngào phong cách Nhật Bản.",
      },
    ],
    pricing: [
      {
        name: "Tráng & Scan 35mm (C-41)",
        format: "35mm (135)",
        process: "Color (C-41)",
        priceVnd: 90000,
        priceFormatted: "90,000 ₫",
        turnaround: "24h - 48h",
        notes: "Độ phân giải tiêu chuẩn JPG 3000x2000",
      },
      {
        name: "Tráng & Scan 120 Medium Format (C-41)",
        format: "120",
        process: "Color (C-41)",
        priceVnd: 120000,
        priceFormatted: "120,000 ₫",
        turnaround: "24h - 48h",
        notes: "Khổ 6x6, 6x7, 6x9 chi tiết siêu nét",
      },
      {
        name: "Tráng & Scan B&W Đen Trắng",
        format: "35mm (135)",
        process: "B&W",
        priceVnd: 110000,
        priceFormatted: "110,000 ₫",
        turnaround: "48h",
        notes: "Pha thuốc Kodak D-76 / HC-110 thủ công",
      },
      {
        name: "Tráng & Scan ECN-2 Điện Ảnh",
        format: "35mm (135)",
        process: "ECN-2",
        priceVnd: 140000,
        priceFormatted: "140,000 ₫",
        turnaround: "48h - 72h",
        notes: "Rửa sạch than Remjet chuyên dụng, không dính bụi than",
      },
      {
        name: "Phụ phí Push / Pull (Mỗi stop)",
        format: "Tất cả",
        process: "Color (C-41)",
        priceVnd: 20000,
        priceFormatted: "+20,000 ₫/stop",
        turnaround: "+0h",
        notes: "Ghi chú rõ trên vỏ film",
      },
    ],
    reviewsList: [
      {
        id: "rev-1",
        author: "Trần Anh Quân",
        rating: 5,
        date: "15/10/2026",
        comment: "Tráng Portra 400 scan máy Noritsu đẹp xuất sắc, sạch bụi, trả file qua link Google Drive rất nhanh.",
        scannedWith: "Noritsu HS-1800",
      },
      {
        id: "rev-2",
        author: "Lê Minh Tuấn",
        rating: 5,
        date: "10/10/2026",
        comment: "ECN-2 ở đây tẩy sạch lớp than remjet 100%, không bị xước phim.",
        scannedWith: "Fuji Frontier SP-3000",
      },
    ],
  },
  {
    id: "lab-2",
    name: "LLab Saigon",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    address: "District 1, Ho Chi Minh City",
    phone: "0909 333 888",
    email: "support@llab.vn",
    openingHours: "08:30 - 21:00 (Mon - Sun)",
    rating: 4.85,
    reviewCount: 428,
    turnaround: "Same Day",
    processes: ["Color (C-41)", "B&W", "ECN-2", "Slide (E-6)"],
    acceptsMailIn: true,
    featuredBadge: "Rapid Turnaround",
    description: "Dịch vụ tráng film nhanh hàng đầu Sài Gòn với tùy chọn lấy trong ngày (Same Day Express). Hỗ trợ đầy đủ các quy trình khó như E-6 Slide và ECN-2.",
    scanners: [
      {
        name: "Fuji Frontier SP-3000 Ultra",
        type: "Dedicated Film Scanner",
        maxResolution: "3600 x 5400 px",
        colorProfile: "Fuji Pastel Aesthetic",
        description: "Tái hiện màu sắc điện ảnh ấm áp và làn da châu Á hoàn hảo.",
      },
    ],
    pricing: [
      {
        name: "Tráng & Scan 35mm C-41 (Same Day)",
        format: "35mm (135)",
        process: "Color (C-41)",
        priceVnd: 100000,
        priceFormatted: "100,000 ₫",
        turnaround: "Trong ngày (6-8h)",
        notes: "Gửi trước 12h trưa nhận file trước 19h tối",
      },
      {
        name: "Tráng & Scan Slide Dương Bản (E-6)",
        format: "35mm (135)",
        process: "Slide (E-6)",
        priceVnd: 180000,
        priceFormatted: "180,000 ₫",
        turnaround: "3-5 Days",
        notes: "Quy trình tráng 6 bước chuẩn Kodak E-6",
      },
      {
        name: "Tráng & Scan ECN-2 Cinema Film",
        format: "35mm (135)",
        process: "ECN-2",
        priceVnd: 130000,
        priceFormatted: "130,000 ₫",
        turnaround: "24h - 48h",
        notes: "Máy tẩy remjet tự động áp lực nước",
      },
    ],
    reviewsList: [
      {
        id: "rev-3",
        author: "Ngô Quốc Bảo",
        rating: 5,
        date: "12/10/2026",
        comment: "Dịch vụ Same Day quá tiện cho ai cần trả file gấp cho khách. Đóng gói âm bản gửi trả rất cẩn thận.",
      },
    ],
  },
  {
    id: "lab-3",
    name: "Darkroom Tokyo",
    city: "Tokyo",
    country: "Japan",
    address: "Shibuya, Tokyo",
    phone: "+81 3 5555 0142",
    email: "info@darkroom-tokyo.jp",
    openingHours: "10:00 - 19:00 (Tue - Sun)",
    rating: 4.95,
    reviewCount: 560,
    turnaround: "1-2 Days",
    processes: ["Color (C-41)", "B&W", "Slide (E-6)"],
    acceptsMailIn: true,
    featuredBadge: "Master Frontier Scans",
    description: "Japanese master darkroom studio specializing in authentic Fuji Frontier color balance and high-end archival preservation.",
    scanners: [
      {
        name: "Frontier SP-3000 Master Unit",
        type: "Frontier Cinema Calibrated",
        maxResolution: "4000 x 6000 px",
        colorProfile: "Authentic Tokyo Tone",
        description: "Master level technician adjustment per individual frame.",
      },
    ],
    pricing: [
      {
        name: "C-41 Standard Dev + High-Res Scan",
        format: "35mm (135)",
        process: "Color (C-41)",
        priceVnd: 220000,
        priceFormatted: "220,000 ₫ (¥1,350)",
        turnaround: "24h",
      },
      {
        name: "Handmade B&W Dev + Scan",
        format: "35mm (135)",
        process: "B&W",
        priceVnd: 280000,
        priceFormatted: "280,000 ₫ (¥1,700)",
        turnaround: "48h",
      },
    ],
    reviewsList: [],
  },
  {
    id: "lab-4",
    name: "Brooklyn Film Camera Lab",
    city: "New York",
    country: "United States",
    address: "Grand St, Brooklyn, NY",
    phone: "+1 718 555 0199",
    email: "lab@brooklynfilmcamera.com",
    openingHours: "11:00 - 18:00 (Wed - Sun)",
    rating: 4.88,
    reviewCount: 680,
    turnaround: "3-5 Days",
    processes: ["Color (C-41)", "B&W", "ECN-2"],
    acceptsMailIn: true,
    description: "NYC's beloved community camera shop and dedicated analog film processing lab.",
    scanners: [
      {
        name: "Noritsu HS-1800 NYC Studio",
        type: "High-res Archival",
        maxResolution: "4800 x 7200 px",
        colorProfile: "Natural Grain Film",
        description: "Archival scans ideal for large prints and commercial publishing.",
      },
    ],
    pricing: [
      {
        name: "Color C-41 Dev & High Res Scan",
        format: "35mm (135)",
        process: "Color (C-41)",
        priceVnd: 350000,
        priceFormatted: "350,000 ₫ ($14.00)",
        turnaround: "3-5 Days",
      },
    ],
    reviewsList: [],
  },
  {
    id: "lab-5",
    name: "Silbersalz35 Lab",
    city: "Stuttgart",
    country: "Germany",
    address: "Baden-Württemberg",
    phone: "+49 711 555 4321",
    email: "hello@silbersalz35.com",
    openingHours: "09:00 - 17:00 (Mon - Fri)",
    rating: 4.92,
    reviewCount: 390,
    turnaround: "3-5 Days",
    processes: ["ECN-2", "Color (C-41)"],
    acceptsMailIn: true,
    featuredBadge: "True Cinema ECN-2",
    description: "World-famous cinema film lab using proprietary Kodak ECN-2 machine processing and 4K Blackmagic / Cinegel color grading.",
    scanners: [
      {
        name: "Silbersalz 16-Bit Cine Scanner",
        type: "True Motion Picture Scanner",
        maxResolution: "4K DCI TIFF (4096 x 3112)",
        colorProfile: "True Kodak Vision3 Cinema",
        description: "16-bit raw scan data for unparalleled color correction latitude.",
      },
    ],
    pricing: [
      {
        name: "True ECN-2 Dev + 4K Cine Scan",
        format: "35mm (135)",
        process: "ECN-2",
        priceVnd: 420000,
        priceFormatted: "420,000 ₫ (€16.50)",
        turnaround: "3-5 Days",
      },
    ],
    reviewsList: [],
  },
  {
    id: "lab-6",
    name: "Danang Film Space",
    city: "Da Nang",
    country: "Vietnam",
    address: "Hai Chau District, Da Nang",
    phone: "0912 456 789",
    email: "contact@danangfilmspace.com",
    openingHours: "09:00 - 19:30 (Mon - Sat)",
    rating: 4.79,
    reviewCount: 185,
    turnaround: "1-2 Days",
    processes: ["Color (C-41)", "B&W"],
    acceptsMailIn: true,
    description: "Không gian kết nối người chụp film tại miền Trung. Nhận film qua bưu điện từ Hội An, Huế, Quảng Nam với thời gian xử lý nhanh chóng.",
    scanners: [
      {
        name: "Fuji Frontier SP-3000",
        type: "Dedicated Film Scanner",
        maxResolution: "3000 x 4500 px",
        colorProfile: "Warm Coastal Tone",
        description: "Tone màu trong trẻo, hợp với ánh sáng biển miền Trung.",
      },
    ],
    pricing: [
      {
        name: "Tráng & Scan 35mm C-41",
        format: "35mm (135)",
        process: "Color (C-41)",
        priceVnd: 85000,
        priceFormatted: "85,000 ₫",
        turnaround: "24h - 48h",
      },
      {
        name: "Tráng & Scan B&W Đen Trắng",
        format: "35mm (135)",
        process: "B&W",
        priceVnd: 100000,
        priceFormatted: "100,000 ₫",
        turnaround: "48h",
      },
    ],
    reviewsList: [],
  },
]
