export interface SubjectInput {
    title: string;
    code: string;
    description?: string;
}

export interface Subject {
    _id: string;
    userId: string;
    title: string;
    code: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SubjectCounts {
    notes: number;
    externalLinks: number;
    studyMaterials: number;
}