import { PhotographerOrderDetail } from "@/components/user/orders/photographer-orders";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <PhotographerOrderDetail orderId={Number(id)} />;
}
