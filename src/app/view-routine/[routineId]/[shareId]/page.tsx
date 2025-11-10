import ViewRoutine from "@/components/view-routine/ViewRoutine";
import { decodeId } from "@/utils/helpers/IdConversion";

interface PageProps {
    params: Promise<{
        routineId: string;
        shareId: string;
    }>;
}

const page = async ({ params }: PageProps) => {
    // Destructure params
    const { routineId, shareId } = await params;

    // Decode URL encoding first (turn %7C back into |)  and then decode the obfuscation format
    const decodedRoutineId = decodeId(decodeURIComponent(routineId));
    const decodedShareId = decodeId(decodeURIComponent(shareId));

    return (
        <ViewRoutine params={{ routineId: decodedRoutineId, shareId: decodedShareId }} />
    );
};

export default page;
