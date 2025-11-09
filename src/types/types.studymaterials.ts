export type FileType = "pdf" | "ppt" | "image" | "other";

export interface StudyMaterial {
    _id: string;
    userId: string;
    subjectId?: string;
    roadmapId?: string;
    filename: string;
    urls: string[];
    fileTypes: FileType[];
    tags: string[];
    description?: string;
    visibility: "private" | "public";
    uploadedAt: Date;
}

export interface CreateStudyMaterialInput {
    subjectId?: string;
    roadmapId?: string;
    filename: string;
    urls: string[];
    fileTypes: FileType[];
    tags: string[];
    description?: string;
    visibility?: "private" | "public";
}

export interface UpdateStudyMaterialInput {
    subjectId?: string;
    roadmapId?: string;
    filename?: string;
    urls?: string[];
    fileTypes?: FileType[];
    tags?: string[];
    description?: string;
    visibility?: "private" | "public";
}
