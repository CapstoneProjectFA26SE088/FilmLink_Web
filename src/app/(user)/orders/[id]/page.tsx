import { notFound } from "next/navigation";
import { PhotographerOrderDetail } from "@/components/user/orders/photographer-orders";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const orderId = Number(id);
	if (!Number.isInteger(orderId) || orderId <= 0) notFound();
	return <PhotographerOrderDetail orderId={orderId} />;
}
