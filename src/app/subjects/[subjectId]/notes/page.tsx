"use client";

import { useParams } from "next/navigation";
import { NoteList } from "@/components/subjects-notes/NoteList";

export default function SubjectNotesPage() {
    const { subjectId } = useParams<{ subjectId: string }>();

    return (
        <div className="container mx-auto p-6">
            <NoteList subjectId={subjectId} />
        </div>
    );
}
