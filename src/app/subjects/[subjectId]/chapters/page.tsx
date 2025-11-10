
import ChaptersPage from "@/components/chapters/ChaptersPage";
import { decodeId } from "@/utils/helpers/IdConversion";

const page = async ({ params }: { params: Promise<{ subjectId: string }> }) => {
    const { subjectId } = await params;

    return (
        <ChaptersPage subjectId={decodeId(decodeURIComponent(subjectId))} />
    )
}

export default page;