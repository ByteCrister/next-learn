import Subjects from "@/components/subjects/Subjects";
import { Suspense } from "react";

const SubjectsPage = () => {
    return (
        <Suspense fallback={<div>Loading subjects...</div>}>
            <Subjects />
        </Suspense>
    )
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default SubjectsPage;
