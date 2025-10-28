import UpdateBatchPage from "@/components/batches/update/UpdateBatchPage";
import { decodeId } from "@/utils/helpers/IdConversion";

interface Props {
    params: { batchId: string };
}

const page = async ({ params }: Props) => {
    const { batchId } = await params;
    return <UpdateBatchPage batchId={decodeId(decodeURIComponent(batchId))} />;
};

export default page;
