import { OrderDetailPage } from "@/components/lab-owner/orders/order-detail-page";

export default async function LabOwnerOrderDetailRoute({ params }: { params: Promise<{ orderId: string }> }) {
	const { orderId } = await params;
	return <OrderDetailPage orderId={orderId} />;
}
