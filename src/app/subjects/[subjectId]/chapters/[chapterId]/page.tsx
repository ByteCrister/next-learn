
import ChapterPage from "@/components/chapters/chapter-by-id/ChapterPage";
import { decodeId } from "@/utils/helpers/IdConversion";

const page = async ({ params }: { params: Promise<{ subjectId: string; chapterId: string }> }) => {
    const {
        subjectId,
        chapterId 
    } = await params;

    return (
        <ChapterPage
            subjectId={decodeId(decodeURIComponent(subjectId))}
            chapterId={decodeId(decodeURIComponent(chapterId))}
        />
    )
}

export default page;