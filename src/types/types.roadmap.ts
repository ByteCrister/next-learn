
export interface VChapter {
    _id: string;
    title: string;
    content: string; // Tiptap JSON string of HTML
}

export interface VCourseRoadmap {
    _id: string;
    title: string;
    description: string;
    roadmap: string; // TipTapJSON string of HTML
    subjectId: string;
    chapters: VChapter[];
}