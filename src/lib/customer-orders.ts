export type CustomerOrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "change_proposed"
  | "cancelled"

export interface LabProposal {
  proposedAt: string
  reason: string
  suggestedProcess?: string
  suggestedPushPull?: string
  priceAdjustmentVnd?: number
  priceAdjustmentFormatted?: string
  notes?: string
}

export type CustomerOrder = {
  id: string
  labId: string
  labName: string
  senderName: string
  phone: string
  email: string
  returnAddress: string
  filmName: string
  format: string
  process: string
  rollCount: string
  pushPull: string
  delivery: string
  note: string
  createdAt: string
  status: CustomerOrderStatus
  workflowStage: number
  rejectReason?: string
  proposal?: LabProposal
  proposalResponse?: "accepted" | "declined"
}

const storageKey = "filmlink-customer-orders"
const updateEvent = "filmlink-customer-orders-updated"

export function getCustomerOrders(): CustomerOrder[] {
  try {
    const value = window.localStorage.getItem(storageKey)
    return value ? (JSON.parse(value) as CustomerOrder[]) : []
  } catch {
    return []
  }
}

export function saveCustomerOrder(order: CustomerOrder) {
  const orders = getCustomerOrders()
  writeCustomerOrders([order, ...orders])
}

export function updateCustomerOrder(id: string, update: Partial<CustomerOrder>) {
  const orders = getCustomerOrders().map((order) =>
    order.id === id ? { ...order, ...update } : order
  )
  writeCustomerOrders(orders)
}

function writeCustomerOrders(orders: CustomerOrder[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(orders))
    window.dispatchEvent(new Event(updateEvent))
  } catch {
    // Keep the UI usable when browser storage is unavailable.
  }
}

export const customerOrdersUpdatedEvent = updateEvent
