import ViewRoutine from "@/components/view-routine/ViewRoutine";
import { decodeId } from "@/utils/helpers/IdConversion";

interface PageProps {
    params: {
        routineId: string;
        shareId: string;
    };
}
const page = async ({ params }: PageProps) => {
    const { routineId, shareId } = await params;
    const decodedRoutineId = decodeId(routineId)
    const decodedShareId = decodeId(shareId)
    return (
        <ViewRoutine params={{ routineId: decodedRoutineId, shareId: decodedShareId }} />
    )
}

export default page