export interface TStudyMaterial {
    title: string;
    type: string; // e.g., 'jpg', 'png', 'pdf', etc
    data: string; // base64
}

export interface TChapter {
    _id?: string;
    title: string;
    content: string;
    materials: TStudyMaterial[];
}