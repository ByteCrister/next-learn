export type TipTapJSON = string; // HTML content

export interface Attachment {
    title: string;
    description?: string;
    mimeType: string;
    data: Buffer;
}

export interface SubjectNoteInput {
    title?: string;
    content: TipTapJSON;
    attachments?: Attachment[];
}

export interface SubjectNote {
    _id: string;
    userId: string;
    subjectId: string;
    title?: string;
    content: TipTapJSON;
    attachments: Attachment[];
    createdAt: string;
    updatedAt: string;
}
