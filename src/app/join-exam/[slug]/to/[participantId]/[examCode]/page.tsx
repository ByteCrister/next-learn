// src/app/join-exam/[slug]/to/[participantId]/[examCode]/page.tsx
import ClientExamRunner from "@/components/join-exam/ClientExamRunner";
import { restoreOriginalObjectId } from "@/utils/helpers/restoreOriginalObjectId";

interface PageProps {
    params: {
        slug: string; // "createdBy-join-examId"
        participantId: string;
        examCode: string;
    };
}

const Page = async ({ params }: PageProps) => {
    const { slug, participantId, examCode } = await params;

    // Split slug to get original createdBy and examId
    const [unsortedCreatedBy, unsortedExamId] = slug.split("-join-");
    const createdBy = restoreOriginalObjectId(unsortedCreatedBy);
    const examId = restoreOriginalObjectId(unsortedExamId);

    return (
        <ClientExamRunner
            createdBy={createdBy}
            examId={examId}
            participantId={participantId}
            examCode={examCode}
        />
    );
};

export default Page;
