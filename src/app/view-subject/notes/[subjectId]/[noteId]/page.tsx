import ViewSharedNotePage from "@/components/view-subject/share-note/ViewSharedNotePage";
import { decodeId } from "@/utils/helpers/IdConversion";

export default async function Page({ params }: { params: Promise<{ subjectId: string; noteId: string; }> }) {
  const { subjectId, noteId } = await params;
  return <ViewSharedNotePage subjectId={decodeId(decodeURIComponent(subjectId))} noteId={decodeId(decodeURIComponent(noteId))} />;
}