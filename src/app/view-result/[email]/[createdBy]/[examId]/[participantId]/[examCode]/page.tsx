import ViewResult from "@/components/view-result/ViewResult";

// /view-result/[email]/[createdBy]/[examId]/[participantId]/[examCode]/page.tsx
interface PageProps {
    params: Promise<{
        email: string;
        createdBy: string;
        examId: string;
        participantId: string;
        examCode: string;
    }>;
}
const page = async ({ params }: PageProps) => {
    return (
        <ViewResult params={await params} />
    )
}

export default page