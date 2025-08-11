import { Types } from "mongoose";

export interface SubjectDTO {
  _id?: Types.ObjectId | string;
  title: string;
  code: string;
  description?: string;
}

export interface ChapterDTO {
  _id?: Types.ObjectId | string;
  title: string;
  content: string;
}

export interface CourseRoadmapDTO {
  _id?: Types.ObjectId | string;
  title: string;
  description: string;
  roadmap: string;
  chapters: ChapterDTO[];
}