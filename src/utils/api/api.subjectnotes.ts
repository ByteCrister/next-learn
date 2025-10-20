import { SubjectNoteInput, SubjectNote } from "@/types/types.subjectnote";

export async function getNotesBySubjectId(subjectId: string, page: number = 1, limit: number = 10): Promise<{ notes: SubjectNote[], total: number, page: number, totalPages: number } | { message: string }> {
    try {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        const res = await fetch(`/api/subjects/${subjectId}/notes?${params}`);
        if (!res.ok) {
            const error = await res.json();
            return { message: error.message || "Failed to fetch notes" };
        }
        const data = await res.json();
        const totalPages = Math.ceil(data.total / limit);
        return { notes: data.notes, total: data.total, page, totalPages };
    } catch (error) {
        return { message: (error as Error).message };
    }
}

export async function createNote(subjectId: string, input: SubjectNoteInput): Promise<SubjectNote | { message: string }> {
    try {
        const res = await fetch(`/api/subjects/${subjectId}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });
        if (!res.ok) {
            const error = await res.json();
            return { message: error.message || "Failed to create note" };
        }
        const data = await res.json();
        return data;
    } catch (error) {
        return { message: (error as Error).message };
    }
}

export async function updateNote(subjectId: string, noteId: string, input: Partial<SubjectNoteInput>): Promise<SubjectNote | { message: string }> {
    try {
        const res = await fetch(`/api/subjects/${subjectId}/notes/${noteId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });
        if (!res.ok) {
            const error = await res.json();
            return { message: error.message || "Failed to update note" };
        }
        const data = await res.json();
        return data;
    } catch (error) {
        return { message: (error as Error).message };
    }
}

export async function deleteNote(subjectId: string, noteId: string): Promise<{ message: string }> {
    try {
        const res = await fetch(`/api/subjects/${subjectId}/notes/${noteId}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const error = await res.json();
            return { message: error.message || "Failed to delete note" };
        }
        const data = await res.json();
        return data;
    } catch (error) {
        return { message: (error as Error).message };
    }
}
