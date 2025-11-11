import ExamDetails from "@/components/exams/ExamDetails"
import { decodeId } from "@/utils/helpers/IdConversion";
interface PageProps {
  params: Promise<{
    examId: string;
  }>;
}
const page = async ({ params }: PageProps) => {
  const { examId } = await params;
  return (
    <ExamDetails examId={decodeId(decodeURIComponent(examId))} />
  )
}

export default page