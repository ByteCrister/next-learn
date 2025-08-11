import { CourseRoadmapDTO, SubjectDTO } from "@/types/types.view.subject";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import OverviewSection from "./OverviewSection";
import RoadmapSection from "./RoadmapSection";
import ChaptersSection from "./ChaptersSection";

// ---------- Body / Tabs ----------
export default function ContentTabs({
    activeTab,
    onTabChange,
    subject,
    roadmap,
}: {
    activeTab: "overview" | "roadmap" | "chapters";
    onTabChange: (t: "overview" | "roadmap" | "chapters") => void;
    subject: SubjectDTO;
    roadmap: CourseRoadmapDTO | null;
}) {

    return (
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "overview" | "roadmap" | "chapters")} className="space-y-4">
            <TabsList className="bg-gradient-to-r from-indigo-500/10 via-transparent to-violet-500/10">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
                <OverviewSection subject={subject} roadmap={roadmap} />
            </TabsContent>

            <TabsContent value="roadmap">
                <RoadmapSection roadmap={roadmap} />
            </TabsContent>

            <TabsContent value="chapters">
                <ChaptersSection roadmap={roadmap} />
            </TabsContent>
        </Tabs>
    );
}