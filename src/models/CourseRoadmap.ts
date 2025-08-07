// ==== models/CourseRoadmap.ts ====
import { Schema, model, models } from 'mongoose';

const StudyMaterialSchema = new Schema({
    name: String,
    type: String,
    data: String, // base64 or URL
});

const SubchapterSchema = new Schema({
    title: String,
    content: {}, // TipTap JSON
    materials: [StudyMaterialSchema],
});

const ChapterSchema = new Schema({
    title: String,
    content: {}, // TipTap JSON
    subchapters: [SubchapterSchema],
    materials: [StudyMaterialSchema],
});

const CourseRoadmapSchema = new Schema({
    title: String,
    description: String,
    chapters: [ChapterSchema],
});

export default models.CourseRoadmap || model("CourseRoadmap", CourseRoadmapSchema);