// G:\Projects\next-learn\src\types\types.roadmap.ts
export interface ISubChapter {
    title: string;
    content?: string; // HTML string
}

export interface IChapter {
    title: string;
    content?: string; // HTML string
    subChapters: ISubChapter[];
}

export interface ICourseRoadmap {
    title: string;
    content?: string; // roadmap intro HTML
    chapters: IChapter[];
}
