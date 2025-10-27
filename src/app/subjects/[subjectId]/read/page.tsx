
// /subjects/[subjectId]/read

import SubjectReadPage from "@/components/subject-read/SubjectReadPage";
import { decodeId } from "@/utils/helpers/IdConversion";

export default async function Page({ params }: { params: Promise<{ subjectId: string }> }) {
    const { subjectId } = await params;
    
    return (
        <SubjectReadPage subjectId={decodeId(decodeURIComponent(subjectId))} />
    )
}