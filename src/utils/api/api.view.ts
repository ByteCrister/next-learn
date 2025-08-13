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
