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
  lens?: string
  filmStock: string
  iso?: number
  devProcess?: string
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
  cameraMetadata?: PostCameraMetadata
  likesCount: number
  commentsCount: number
  sharesCount: number
  isLiked?: boolean
  tags: string[]
  comments?: PostComment[]
}

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
    cameraMetadata: {
      camera: "Olympus OM-1",
      lens: "Zuiko 50mm f/1.4",
      filmStock: "Kodak Portra 400",
      iso: 400,
      devProcess: "Color (C-41)",
      lab: "Croplab Hanoi",
    },
    likesCount: 370,
    commentsCount: 13,
    sharesCount: 5,
    isLiked: false,
    tags: ["#filmphotography", "#kodakportra400", "#olympusom1", "#hanoivintage"],
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
    cameraMetadata: {
      camera: "Canon AE-1 Program",
      lens: "Canon FD 35mm f/2",
      filmStock: "Cinestill 800T",
      iso: 800,
      devProcess: "ECN-2",
      lab: "LLab Saigon",
    },
    likesCount: 524,
    commentsCount: 28,
    sharesCount: 19,
    isLiked: true,
    tags: ["#cinestill800t", "#dalatfog", "#analogvn", "#ecn2"],
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
    cameraMetadata: {
      camera: "Leica M6",
      lens: "Summicron 35mm f/2",
      filmStock: "Ilford HP5 Plus",
      iso: 800,
      devProcess: "B&W",
      lab: "Danang Film Space",
    },
    likesCount: 289,
    commentsCount: 8,
    sharesCount: 12,
    isLiked: false,
    tags: ["#blackandwhite", "#ilfordhp5", "#leicam6", "#filmcommunity"],
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
    cameraMetadata: {
      camera: "Rolleiflex 2.8F",
      lens: "Carl Zeiss Planar 80mm f/2.8",
      filmStock: "Kodak Gold 200 (120)",
      iso: 200,
      devProcess: "Color (C-41)",
      lab: "Croplab Hanoi",
    },
    likesCount: 195,
    commentsCount: 6,
    sharesCount: 4,
    isLiked: false,
    tags: ["#rolleiflex", "#kodakgold200", "#120film", "#mediumformat"],
  },
]
