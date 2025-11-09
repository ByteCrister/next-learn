import { NoteList } from "@/components/subjects-notes/NoteList";
import { decodeId } from "@/utils/helpers/IdConversion";

const page = async ({ params }: { params: Promise<{ subjectId: string }> }) => {
    const { subjectId } = await params;
    return <NoteList subjectId={decodeId(decodeURIComponent(subjectId))} />
}

export default page;