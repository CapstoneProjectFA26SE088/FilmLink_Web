export interface LabKpiMetric {
  title: string
  value: string | number
  unit?: string
  trend: string
  isPositive: boolean
  description: string
}

export interface LabQueueStatusItem {
  stage: string
  count: number
  color: string
  badgeVariant: "default" | "secondary" | "outline" | "destructive"
}

export interface LabChemicalBath {
  id: string
  name: string
  process: string
  healthPercent: number
  status: "optimal" | "replenish-soon" | "critical"
  remainingRolls: number
  temperatureCelsius: number
  lastMixed: string
}

export interface LabScannerUnit {
  id: string
  model: string
  name: string
  status: "idle" | "scanning" | "maintenance"
  currentJob?: string
  completedToday: number
  efficiency: string
}

export interface LabRecentActivity {
  id: string
  title: string
  description: string
  timestamp: string
  type: "order_approved" | "scan_uploaded" | "ai_passed" | "order_completed" | "chemical_alert"
  orderId?: string
}

export interface LabDashboardData {
  labName: string
  ownerName: string
  kpis: {
    todayOrders: LabKpiMetric
    inQueueRolls: LabKpiMetric
    monthlyRevenue: LabKpiMetric
    turnaroundTime: LabKpiMetric
  }
  queueStatus: LabQueueStatusItem[]
  chemicalBaths: LabChemicalBath[]
  scanners: LabScannerUnit[]
  recentActivities: LabRecentActivity[]
}

export const MOCK_LAB_DASHBOARD: LabDashboardData = {
  labName: "Croplab Hanoi",
  ownerName: "Tuan Nguyen (Lab Master)",
  kpis: {
    todayOrders: {
      title: "Hôm nay nhận",
      value: 28,
      unit: "đơn",
      trend: "+16.7%",
      isPositive: true,
      description: "Tăng so với ngày hôm qua",
    },
    inQueueRolls: {
      title: "Cuộn đang xử lý",
      value: 64,
      unit: "cuộn",
      trend: "42 C-41 · 14 ECN-2 · 8 B&W",
      isPositive: true,
      description: "Trong hàng đợi tráng & scan",
    },
    monthlyRevenue: {
      title: "Doanh thu tháng này",
      value: "38.5",
      unit: "triệu VNĐ",
      trend: "+12.4%",
      isPositive: true,
      description: "Đạt 92% chỉ tiêu tháng",
    },
    turnaroundTime: {
      title: "Thời gian trả file TB",
      value: "22.5",
      unit: "giờ",
      trend: "-3.2h (Nhanh hơn)",
      isPositive: true,
      description: "Tối ưu hóa nhờ AI QC workflow",
    },
  },
  queueStatus: [
    { stage: "Chờ duyệt", count: 5, color: "text-amber-500", badgeVariant: "outline" },
    { stage: "Đang tráng (Dev)", count: 18, color: "text-blue-500", badgeVariant: "secondary" },
    { stage: "Đang scan", count: 14, color: "text-indigo-500", badgeVariant: "secondary" },
    { stage: "Kiểm tra AI QC", count: 6, color: "text-purple-500", badgeVariant: "secondary" },
    { stage: "Sẵn sàng trả khách", count: 21, color: "text-emerald-500", badgeVariant: "default" },
  ],
  chemicalBaths: [
    {
      id: "chem-1",
      name: "Bể thuốc hiện C-41 (Developer)",
      process: "Color (C-41)",
      healthPercent: 88,
      status: "optimal",
      remainingRolls: 110,
      temperatureCelsius: 38.0,
      lastMixed: "Hôm qua lúc 08:00",
    },
    {
      id: "chem-2",
      name: "Bể tẩy than Remjet & ECN-2",
      process: "ECN-2 Cinema",
      healthPercent: 72,
      status: "optimal",
      remainingRolls: 35,
      temperatureCelsius: 27.0,
      lastMixed: "3 ngày trước",
    },
    {
      id: "chem-3",
      name: "Thuốc hiện đen trắng Kodak D-76",
      process: "B&W Manual",
      healthPercent: 94,
      status: "optimal",
      remainingRolls: 50,
      temperatureCelsius: 20.0,
      lastMixed: "Sáng nay",
    },
    {
      id: "chem-4",
      name: "Bể hãm Fixer Rapid C-41",
      process: "Color & B&W",
      healthPercent: 45,
      status: "replenish-soon",
      remainingRolls: 18,
      temperatureCelsius: 38.0,
      lastMixed: "5 ngày trước",
    },
  ],
  scanners: [
    {
      id: "scan-1",
      model: "Noritsu HS-1800",
      name: "Máy Scan Noritsu Line A",
      status: "scanning",
      currentJob: "Đơn #ORD-8488 · 35mm C-41 (36 frames)",
      completedToday: 32,
      efficiency: "98%",
    },
    {
      id: "scan-2",
      model: "Fuji Frontier SP-3000",
      name: "Máy Scan Frontier Line B",
      status: "scanning",
      currentJob: "Đơn #ORD-8475 · 120 Medium (6x7)",
      completedToday: 24,
      efficiency: "95%",
    },
    {
      id: "scan-3",
      model: "Epson V850 Pro Flatbed",
      name: "Máy Scan Khổ Lớn Sheet Film",
      status: "idle",
      completedToday: 4,
      efficiency: "100%",
    },
  ],
  recentActivities: [
    {
      id: "act-1",
      title: "Đơn hàng mới hoàn tất scan",
      description: "Đơn #ORD-8475 (3 cuộn Ilford HP5) đã qua AI Quality Check 10/10.",
      timestamp: "10 phút trước",
      type: "ai_passed",
      orderId: "ORD-8475",
    },
    {
      id: "act-2",
      title: "Đã duyệt đơn khách gửi",
      description: "Kỹ thuật viên đã duyệt đơn #ORD-8488 của khách Lê Thu Trang.",
      timestamp: "35 phút trước",
      type: "order_approved",
      orderId: "ORD-8488",
    },
    {
      id: "act-3",
      title: "Link tải file đã gửi qua Email",
      description: "Gửi thư viện ảnh số cho đơn #ORD-8450 (Hoàng Nam) thành công.",
      timestamp: "1 giờ trước",
      type: "order_completed",
      orderId: "ORD-8450",
    },
    {
      id: "act-4",
      title: "Cảnh báo bổ sung thuốc hãm Fixer",
      description: "Bể thuốc hãm Fixer Rapid C-41 còn dưới 50% dung lượng.",
      timestamp: "2 giờ trước",
      type: "chemical_alert",
    },
  ],
}
