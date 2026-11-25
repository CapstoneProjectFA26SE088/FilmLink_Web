import { AdminQueueScreen } from "@/components/admin/admin-pages";
import { KnowledgeBaseReindexCard } from "@/components/admin/knowledge-base-reindex-card";

export default function Page() {
	return <AdminQueueScreen section="knowledge-base" beforeQueue={<KnowledgeBaseReindexCard />} />;
}

