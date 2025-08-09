import { TipTapJSON } from "@/models/CourseRoadmap";

export interface VChapter {
    _id: string;
    title: string;
}

export interface VCourseRoadmap {
    _id: string;
    title: string;
    description: string;
    roadmap: TipTapJSON;
    subjectId: string;
    chapters: VChapter[];
}