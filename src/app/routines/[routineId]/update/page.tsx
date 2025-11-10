import UpdateRoutinePage from "@/components/routine/update/UpdateRoutinePage";
import { decodeId } from "@/utils/helpers/IdConversion";

export default async function Page({ params }: { params: Promise<{ routineId: string }> }) {
  const { routineId } = await params;
  return <UpdateRoutinePage routineId={decodeId(decodeURIComponent(routineId))} />;
}
