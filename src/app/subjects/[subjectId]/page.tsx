// import SubjectPage from "@/components/subjects-subject/SubjectPage"; 
import SubjectPage from "@/components/subjects-subject/SubjectPage"; 
import { decodeId } from "@/utils/helpers/IdConversion";

export default async function Page({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  return <SubjectPage subjectId={decodeId(decodeURIComponent(subjectId))} />;
}
