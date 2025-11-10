
import StudyMaterialsPage from "@/components/study-materials/StudyMaterialsPage";
import { decodeId } from "@/utils/helpers/IdConversion";

const Page = async ({ params }: { params: Promise<{ subjectId: string }> }) => {
    const { subjectId } = await params;

    return (
        <StudyMaterialsPage subjectId={decodeId(decodeURIComponent(subjectId))} />
    )
}

export default Page;