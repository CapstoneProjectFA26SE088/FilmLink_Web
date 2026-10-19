export type PhotoStyle =
  | "street"
  | "portrait"
  | "cinematic"
  | "vintage"
  | "bw_grainy"
  | "landscape"
  | "night_vibes"

export interface PostAuthor {
  id: string
  name: string
  username: string
  avatarUrl: string
  isVerified?: boolean
  bio?: string
}

export interface PostComment {
  id: string
  author: string
  username: string
  avatarUrl: string
  content: string
  createdAt: string
  timeAgo: string
}

export interface PostCameraMetadata {
  camera: string
  cameraType?: "SLR" | "Rangefinder" | "TLR" | "Point & Shoot" | "Medium Format"
  lens?: string
  filmStock: string
  format?: "35mm" | "120" | "large_format"
  iso?: number
  devProcess?: string
  scanner?: string
  lab?: string
}

export interface UserFeedPost {
  id: string
  author: PostAuthor
  createdAt: string
  timeAgo: string
  content: string
  imageUrl?: string
  aspectRatio?: "4/5" | "1/1" | "16/9"
  style?: PhotoStyle
  styleLabel?: string
  cameraMetadata?: PostCameraMetadata
  likesCount: number
  commentsCount: number
  sharesCount: number
  isLiked?: boolean
  tags: string[]
  comments?: PostComment[]
}

export const FEED_STYLES: { id: PhotoStyle | "all"; label: string; iconName?: string }[] = [
  { id: "all", label: "Tất cả phong cách" },
  { id: "street", label: "Street / Đời thường" },
  { id: "portrait", label: "Portrait / Chân dung" },
  { id: "cinematic", label: "Cinematic / Điện ảnh" },
  { id: "vintage", label: "Vintage / Hoài niệm" },
  { id: "bw_grainy", label: "B&W Grainy / Đen trắng hạt" },
  { id: "landscape", label: "Landscape / Phong cảnh" },
  { id: "night_vibes", label: "Night vibes / Đêm nghệ thuật" },
]

export const POPULAR_FEED_TAGS = [
  "#street",
  "#portrait",
  "#cinematic",
  "#blackandwhite",
  "#kodakportra400",
  "#cinestill800t",
  "#mediumformat",
  "#120film",
  "#leicam6",
  "#olympusom1",
  "#vintage",
  "#nightvibes",
]

export const MOCK_USER_FEED_POSTS: UserFeedPost[] = [
  {
    id: "post-1",
    author: {
      id: "u-1",
      name: "Single Father",
      username: "single__father__",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      bio: "Street & documentary analog photography | Hanoi",
    },
    createdAt: "2026-10-19T08:30:00.000Z",
    timeAgo: "18h",
    content: "Thà mất 1m5 chớ k muốn đóng 600k tiền học lại 🤣. Cuối tuần lang thang góc phố cổ cùng cuộn Portra 400 vừa khui hộp, nắng xiên hoàng hôn đẹp mê hồn.",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=900&auto=format&fit=crop&q=80",
    aspectRatio: "4/5",
    style: "street",
    styleLabel: "Street / Đời thường",
    cameraMetadata: {
      camera: "Olympus OM-1",
      cameraType: "SLR",
      lens: "Zuiko 50mm f/1.4",
      filmStock: "Kodak Portra 400",
      format: "35mm",
      iso: 400,
      devProcess: "Color (C-41)",
      scanner: "Noritsu HS-1800",
      lab: "Croplab Hanoi",
    },
    likesCount: 370,
    commentsCount: 13,
    sharesCount: 5,
    isLiked: false,
    tags: ["#filmphotography", "#kodakportra400", "#olympusom1", "#street", "#hanoivintage"],
    comments: [
      {
        id: "c-1",
        author: "Minh Trang",
        username: "trang.analog",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        content: "Màu da và độ chuyển sáng của Portra 400 vẫn là chân ái anh ơi!",
        createdAt: "2026-10-19T09:15:00.000Z",
        timeAgo: "17h",
      },
      {
        id: "c-2",
        author: "Hai Nam",
        username: "nam_vintage_cams",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        content: "Lens Zuiko 50 1.4 nét căng ngay tại f/2 luôn, tone ảnh ấm áp quá.",
        createdAt: "2026-10-19T10:00:00.000Z",
        timeAgo: "16h",
      },
    ],
  },
  {
    id: "post-2",
    author: {
      id: "u-2",
      name: "Thao Linh",
      username: "thaolinh.film",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      bio: "Medium format enthusiast & darkroom printer",
    },
    createdAt: "2026-10-19T11:20:00.000Z",
    timeAgo: "12h",
    content: "Đà Lạt buổi sáng sương mù với Cinestill 800T tráng ECN-2 chuẩn cine. Hiệu ứng halation đỏ quanh bóng đèn xe máy tạo cảm giác vừa huyền ảo vừa hoài niệm.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80",
    aspectRatio: "4/5",
    style: "cinematic",
    styleLabel: "Cinematic / Điện ảnh",
    cameraMetadata: {
      camera: "Canon AE-1 Program",
      cameraType: "SLR",
      lens: "Canon FD 35mm f/2",
      filmStock: "Cinestill 800T",
      format: "35mm",
      iso: 800,
      devProcess: "ECN-2",
      scanner: "Fuji Frontier SP-3000",
      lab: "LLab Saigon",
    },
    likesCount: 524,
    commentsCount: 28,
    sharesCount: 19,
    isLiked: true,
    tags: ["#cinestill800t", "#cinematic", "#dalatfog", "#analogvn", "#ecn2"],
    comments: [
      {
        id: "c-3",
        author: "Bao Long",
        username: "long_cinematic",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        content: "Lab nào tráng ECN-2 sạch remjet thế bạn ơi? Màu lên trong vắt!",
        createdAt: "2026-10-19T12:00:00.000Z",
        timeAgo: "11h",
      },
    ],
  },
  {
    id: "post-3",
    author: {
      id: "u-3",
      name: "Danang Film Club",
      username: "danang_analog",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      bio: "Cộng đồng những người yêu film miền Trung",
    },
    createdAt: "2026-10-19T14:45:00.000Z",
    timeAgo: "6h",
    content: "Chụp đen trắng trời nhiều mây với Ilford HP5 Plus push +1 stop (ISO 800). Tương phản gắt vừa đủ, chi tiết vùng tối vẫn giữ được trọn vẹn nhờ tráng thuốc D-76 thủ công.",
    imageUrl: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=900&auto=format&fit=crop&q=80",
    aspectRatio: "4/5",
    style: "bw_grainy",
    styleLabel: "B&W Grainy / Đen trắng hạt",
    cameraMetadata: {
      camera: "Leica M6",
      cameraType: "Rangefinder",
      lens: "Summicron 35mm f/2",
      filmStock: "Ilford HP5 Plus",
      format: "35mm",
      iso: 800,
      devProcess: "B&W",
      scanner: "Noritsu HS-1800",
      lab: "Danang Film Space",
    },
    likesCount: 289,
    commentsCount: 8,
    sharesCount: 12,
    isLiked: false,
    tags: ["#blackandwhite", "#ilfordhp5", "#leicam6", "#filmcommunity", "#grainisgood"],
  },
  {
    id: "post-4",
    author: {
      id: "u-4",
      name: "Hoang Nam",
      username: "nam.grain",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      bio: "Vintage cameras collector & 120 film shooter",
    },
    createdAt: "2026-10-19T16:10:00.000Z",
    timeAgo: "3h",
    content: "Cuộn Kodak Gold 200 khổ 120 trên thân máy Rolleiflex. Chi tiết và độ sâu trường ảnh của medium format vẫn luôn đem lại cảm giác điện ảnh rất riêng.",
    imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=900&auto=format&fit=crop&q=80",
    aspectRatio: "4/5",
    style: "vintage",
    styleLabel: "Vintage / Hoài niệm",
    cameraMetadata: {
      camera: "Rolleiflex 2.8F",
      cameraType: "TLR",
      lens: "Carl Zeiss Planar 80mm f/2.8",
      filmStock: "Kodak Gold 200 (120)",
      format: "120",
      iso: 200,
      devProcess: "Color (C-41)",
      scanner: "Epson V850 Pro",
      lab: "Croplab Hanoi",
    },
    likesCount: 195,
    commentsCount: 6,
    sharesCount: 4,
    isLiked: false,
    tags: ["#rolleiflex", "#kodakgold200", "#120film", "#mediumformat", "#vintage"],
  },
  {
    id: "post-5",
    author: {
      id: "u-5",
      name: "Mai Anh",
      username: "maianh.shoots",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      bio: "Portrait & Fashion analog photographer",
    },
    createdAt: "2026-10-19T16:30:00.000Z",
    timeAgo: "2h",
    content: "Chân dung bạn thân trong ánh nắng chiều Hồ Tây. Màu xanh pastel đặc trưng của Fujifilm Pro 400H kết hợp cùng độ nét quang học Carl Zeiss 45mm f/2 của Contax G2 thật sự kỳ diệu.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    aspectRatio: "4/5",
    style: "portrait",
    styleLabel: "Portrait / Chân dung",
    cameraMetadata: {
      camera: "Contax G2",
      cameraType: "Rangefinder",
      lens: "Carl Zeiss Planar 45mm f/2",
      filmStock: "Fujifilm Pro 400H",
      format: "35mm",
      iso: 400,
      devProcess: "Color (C-41)",
      scanner: "Fuji Frontier SP-3000",
      lab: "Zone5 Film Lab",
    },
    likesCount: 412,
    commentsCount: 19,
    sharesCount: 15,
    isLiked: false,
    tags: ["#portrait", "#fujipro400h", "#contaxg2", "#softlight", "#35mmfilm"],
  },
  {
    id: "post-6",
    author: {
      id: "u-6",
      name: "Tran Viet",
      username: "viet_film_travel",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      bio: "Nature & landscape explorer with Hasselblad",
    },
    createdAt: "2026-10-19T17:00:00.000Z",
    timeAgo: "1h",
    content: "Vịnh Hạ Long trong sương sớm nhìn từ đỉnh núi Bài Thơ. Kodak Ektar 100 cho độ phân giải siêu nét, hạt cực mịn và màu sắc rực rỡ ngoạn mục trên khổ vuông 6x6.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    aspectRatio: "1/1",
    style: "landscape",
    styleLabel: "Landscape / Phong cảnh",
    cameraMetadata: {
      camera: "Hasselblad 500C/M",
      cameraType: "Medium Format",
      lens: "Carl Zeiss Distagon 50mm f/4",
      filmStock: "Kodak Ektar 100",
      format: "120",
      iso: 100,
      devProcess: "Color (C-41)",
      scanner: "Imacon Flextight",
      lab: "Croplab Saigon",
    },
    likesCount: 631,
    commentsCount: 34,
    sharesCount: 27,
    isLiked: true,
    tags: ["#landscape", "#hasselblad", "#ektar100", "#120film", "#halongbay", "#mediumformat"],
  },
  {
    id: "post-7",
    author: {
      id: "u-7",
      name: "Duc Huy",
      username: "huy_nightowl",
      avatarUrl: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&auto=format&fit=crop&q=80",
      bio: "Night street walker & snapshot shooter",
    },
    createdAt: "2026-10-19T17:15:00.000Z",
    timeAgo: "45m",
    content: "Dạo phố Bùi Viện đêm muộn cùng Olympus Mju II flash on. Đốm sáng đỏ halation của Cinestill 800T hòa quyện với ánh đèn neon biển hiệu tạo không khí cyberpunk rất đã.",
    imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&auto=format&fit=crop&q=80",
    aspectRatio: "4/5",
    style: "night_vibes",
    styleLabel: "Night vibes / Đêm nghệ thuật",
    cameraMetadata: {
      camera: "Olympus Mju II",
      cameraType: "Point & Shoot",
      lens: "Olympus Lens 35mm f/2.8",
      filmStock: "Cinestill 800T",
      format: "35mm",
      iso: 800,
      devProcess: "ECN-2",
      scanner: "Noritsu HS-1800",
      lab: "LLab Hanoi",
    },
    likesCount: 348,
    commentsCount: 15,
    sharesCount: 8,
    isLiked: false,
    tags: ["#nightvibes", "#olympusmjuii", "#cinestill800t", "#flashphotography", "#street"],
  },
  {
    id: "post-8",
    author: {
      id: "u-8",
      name: "Vu Quan",
      username: "quan.streetfilm",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      bio: "Documentary photographer | Black & white darkroom fan",
    },
    createdAt: "2026-10-19T17:30:00.000Z",
    timeAgo: "20m",
    content: "Chợ hoa đêm Quảng Bá đẩy ISO lên 1600 (Push 2 stop thuốc Rodinal 1:50). Hạt film to nổi rõ, tương phản mạnh đậm chất phóng sự tư liệu đường phố.",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=900&auto=format&fit=crop&q=80",
    aspectRatio: "4/5",
    style: "street",
    styleLabel: "Street / Đời thường",
    cameraMetadata: {
      camera: "Leica M3",
      cameraType: "Rangefinder",
      lens: "Summicron 50mm f/2",
      filmStock: "Kodak Tri-X 400",
      format: "35mm",
      iso: 1600,
      devProcess: "B&W",
      scanner: "Noritsu HS-1800",
      lab: "Danang Film Space",
    },
    likesCount: 220,
    commentsCount: 9,
    sharesCount: 6,
    isLiked: false,
    tags: ["#street", "#leicam3", "#kodaktrix", "#pushprocess", "#blackandwhite", "#grainisgood"],
  },
]
