
import ExternalLinksPage from "@/components/external-links/ExternalLinksPage";
import { decodeId } from "@/utils/helpers/IdConversion";

const page = async ({ params }: { params: Promise<{ subjectId: string }> }) => {
    const { subjectId } = await params;

    return (
        <ExternalLinksPage subjectId={decodeId(decodeURIComponent(subjectId))} />
    )
}

export default page;