import BatchSnapshot from "@/components/batches/batch/BatchSnapshot";
import { decodeId } from "@/utils/helpers/IdConversion";

const page = async ({ params }: { params: Promise<{ batchId: string }> }) => {
    const { batchId } = await params;
    return (
        <BatchSnapshot batchId={decodeId(decodeURIComponent(batchId))} />
    )
}

export default page