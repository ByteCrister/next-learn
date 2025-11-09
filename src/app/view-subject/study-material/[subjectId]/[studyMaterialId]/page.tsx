import ViewSharedStudyMaterialPage from "@/components/view-subject/share-materials/ViewSharedStudyMaterialPage";
import { decodeId } from "@/utils/helpers/IdConversion";

export default async function Page({ params }: { params: Promise<{ subjectId: string; studyMaterialId: string; }> }) {
  const { subjectId, studyMaterialId } = await params;
  return <ViewSharedStudyMaterialPage subjectId={decodeId(decodeURIComponent(subjectId))} studyMaterialId={decodeId(decodeURIComponent(studyMaterialId))} />;
}