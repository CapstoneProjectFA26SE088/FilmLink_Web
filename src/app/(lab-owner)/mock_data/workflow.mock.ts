export interface ProcessingLine {
  id: string
  name: string
  processType: string
  equipment: string
  technician: string
  status: "available" | "busy" | "maintenance"
  capacityRollsPerHour: number
  description: string
}

export interface AiQualityReport {
  orderId: string
  resolution: string
  totalFrames: number
  validFrames: number
  dustScratchScore: number
  colorBalanceAccuracy: number
  grainSharpnessScore: number
  overallStatus: "passed" | "warning" | "failed"
  detectedIssues: string[]
  sampleImages: string[]
}

export const MOCK_PROCESSING_LINES: ProcessingLine[] = [
  {
    id: "line-c41-noritsu",
    name: "Dây chuyền Noritsu V30 (C-41 Auto)",
    processType: "Color (C-41)",
    equipment: "Noritsu V30 Auto Dip & Dunk Film Processor",
    technician: "KTV. Tuấn Nguyễn",
    status: "available",
    capacityRollsPerHour: 20,
    description: "Tráng tự động nhiệt độ kiểm soát vi xử lý 38°C ± 0.2°C, độ đồng đều hoàn hảo.",
  },
  {
    id: "line-ecn2-cine",
    name: "Dây chuyền ECN-2 Điện Ảnh (Remjet Wash)",
    processType: "ECN-2",
    equipment: "Jobo ATL-1500 Rotary + High Pressure Remjet Wash Tank",
    technician: "KTV. Nam Trần",
    status: "available",
    capacityRollsPerHour: 8,
    description: "Quy trình tẩy sạch than Remjet bằng dung dịch đệm kiềm và vòi xịt chuyên dụng.",
  },
  {
    id: "line-bw-manual",
    name: "Bàn tráng B&W Thủ Công (Rotary Tank)",
    processType: "B&W",
    equipment: "Paterson System 4 Rotary + D-76 / Rodinal Chemistry",
    technician: "KTV. Quang Huy",
    status: "available",
    capacityRollsPerHour: 6,
    description: "Pha chế thuốc riêng theo từng loại film (Tri-X, HP5, Delta) và bù trừ push/pull.",
  },
  {
    id: "line-scan-noritsu",
    name: "Trạm Scan Noritsu HS-1800 (Digital Archival)",
    processType: "Scanning",
    equipment: "Noritsu HS-1800 Film Carrier (135/120)",
    technician: "KTV. Thảo Vy",
    status: "available",
    capacityRollsPerHour: 12,
    description: "Scan độ phân giải 4000x6000 px, hạt sắc nét và dải dynamic range tối đa.",
  },
]

export const MOCK_AI_QUALITY_REPORTS: Record<string, AiQualityReport> = {
  default: {
    orderId: "default",
    resolution: "3024 x 2016 px (24MP High-Res)",
    totalFrames: 36,
    validFrames: 36,
    dustScratchScore: 9.8,
    colorBalanceAccuracy: 98.5,
    grainSharpnessScore: 9.6,
    overallStatus: "passed",
    detectedIssues: ["Không phát hiện bụi xước nghiêm trọng", "Cân bằng trắng chuẩn xác"],
    sampleImages: [
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=600&auto=format&fit=crop&q=80",
    ],
  },
}
