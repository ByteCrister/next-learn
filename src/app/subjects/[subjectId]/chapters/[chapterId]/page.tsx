
import ChaptersPage from "@/components/chapters/ChaptersPage";
import { decodeId } from "@/utils/helpers/IdConversion";

const page = async ({ params }: { params: Promise<{ subjectId: string; chapterId : string  }> }) => {
    const { subjectId, chapterId } = await params;

    return (
        <ChaptersPage 
        subjectId={decodeId(decodeURIComponent(subjectId))}
        chapterId={decodeId(decodeURIComponent(chapterId))} />
    )
}

export default page;