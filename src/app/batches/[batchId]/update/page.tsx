import UpdateBatchPage from "@/components/batches/update/UpdateBatchPage";
import { decodeId } from "@/utils/helpers/IdConversion";

const page = async ({ params }: { params: { batchId: string } }) => {
  const { batchId } = await params;
  return (
    <UpdateBatchPage batchId={decodeId(decodeURIComponent(batchId))} />
  )
}

export default page