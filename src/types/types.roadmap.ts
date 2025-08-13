
export interface VChapter {
    _id: string;
    title: string;
}

export interface VCourseRoadmap {
    _id: string;
    title: string;
    description: string;
    roadmap: string;
    subjectId: string;
    chapters: VChapter[];
}