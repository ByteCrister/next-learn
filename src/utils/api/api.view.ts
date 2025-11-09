import { CourseRoadmapDTO, SubjectDTO } from "@/types/types.view.subject";
import extractErrorData from "../helpers/extractErrorData";
import api from "./api.client";

const MAIN_ROUTE_URL = "/view"; // match API route

export async function getViewSubject(subjectId: string): Promise<
    { subject: SubjectDTO; roadmap: CourseRoadmapDTO | null } | { message: string }
> {
    try {
        const { data } = await api.get<{ subject: SubjectDTO; roadmap: CourseRoadmapDTO | null }>(
            `${MAIN_ROUTE_URL}/subject`,
            { params: { subjectId } }
        );
        return data;
    } catch (err) {
        console.error("getViewSubject error:", err);
        return extractErrorData(err);
    }
}

export async function getViewNote(subjectId: string, noteId: string): Promise<
    { note: any; subject: { title: string; code?: string } } | { message: string }
> {
    try {
        const { data } = await api.get<{ note: any; subject: { title: string; code?: string } }>(
            `${MAIN_ROUTE_URL}/notes`,
            { params: { subjectId, noteId } }
        );
        return data;
    } catch (err) {
        console.error("getViewNote error:", err);
        return extractErrorData(err);
    }
}

export async function getViewStudyMaterials(subjectId: string): Promise<
    { studyMaterials: any[]; externalLinks: any[]; subject: { title: string; code?: string } } | { message: string }
> {
    try {
        const { data } = await api.get<{ studyMaterials: any[]; externalLinks: any[]; subject: { title: string; code?: string } }>(
            `${MAIN_ROUTE_URL}/study-materials`,
            { params: { subjectId } }
        );
        return data;
    } catch (err) {
        console.error("getViewStudyMaterials error:", err);
        return extractErrorData(err);
    }
}

export async function getViewStudyMaterial(subjectId: string, studyMaterialId: string): Promise<
    { studyMaterial: any; externalLink: any; subject: { title: string; code?: string } } | { message: string }
> {
    try {
        const { data } = await api.get<{ studyMaterial: any; externalLink: any; subject: { title: string; code?: string } }>(
            `${MAIN_ROUTE_URL}/study-material`,
            { params: { subjectId, studyMaterialId } }
        );
        return data;
    } catch (err) {
        console.error("getViewStudyMaterial error:", err);
        return extractErrorData(err);
    }
}

export async function getViewExternalLink(subjectId: string, externalLinkId: string): Promise<
    { externalLink: any; subject: { title: string; code?: string } } | { message: string }
> {
    try {
        const { data } = await api.get<{ externalLink: any; subject: { title: string; code?: string } }>(
            `${MAIN_ROUTE_URL}/external-link`,
            { params: { subjectId, externalLinkId } }
        );
        return data;
    } catch (err) {
        console.error("getViewExternalLink error:", err);
        return extractErrorData(err);
    }
}
