import { OrderScanPage } from "@/components/lab-owner/orders/order-scan-page";

export default async function LabOwnerOrderScanRoute({ params }: { params: Promise<{ orderId: string }> }) {
	const { orderId } = await params;
	return <OrderScanPage orderId={orderId} />;
}
