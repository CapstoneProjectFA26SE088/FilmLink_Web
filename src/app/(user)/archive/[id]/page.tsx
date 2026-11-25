import { PhotographerArchiveDetail } from "@/components/user/archive/photographer-archive";

export default async function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <PhotographerArchiveDetail archiveRollId={Number(id)} />;
}
