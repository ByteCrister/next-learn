import ViewSharedExternalLinkPage from "@/components/view-subject/share-external-links/ViewSharedExternalLinkPage";
import { decodeId } from "@/utils/helpers/IdConversion";

export default async function Page({ params }: { params: Promise<{ subjectId: string; externalLinkId: string; }> }) {
  const { subjectId, externalLinkId } = await params;
  return <ViewSharedExternalLinkPage subjectId={decodeId(decodeURIComponent(subjectId))} externalLinkId={decodeId(decodeURIComponent(externalLinkId))} />;
}