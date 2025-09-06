// import SubjectPage from "@/components/subjects-subject/SubjectPage"; 
import SubjectPage from "@/components/subjects-subject/SubjectPage"; 

export default async function Page({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  return <SubjectPage subjectId={subjectId} />;
}
