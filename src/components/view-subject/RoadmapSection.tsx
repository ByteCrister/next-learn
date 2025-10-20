import { CourseRoadmapDTO } from "@/types/types.view.subject";
import EmptyState from "./EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import HtmlContent from "../global/HtmlContent";
import { ScrollArea } from "../ui/scroll-area";
import { toSlug } from "@/utils/helpers/toSlug";

export default function RoadmapSection({ roadmap }: { roadmap: CourseRoadmapDTO | null }) {
  if (!roadmap) {
    return (
      <EmptyState
        title="No roadmap yet"
        description="Once a roadmap is added, you’ll see the full plan here."
        action={null}
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card className="border-white/10 bg-white/5 dark:bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="text-base">{roadmap.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <HtmlContent html={roadmap.roadmap} />
        </CardContent>
      </Card>

      <aside className="order-first lg:order-last">
        <Card className="sticky top-6 border-white/10 bg-white/5 dark:bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-base">Chapters</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {roadmap.chapters?.length ? (
              <ScrollArea className="h-64">
                <ol className="space-y-2">
                  {roadmap.chapters.map((c, i) => (
                    <li key={c._id?.toString() ?? c.title} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500/15 text-xs text-indigo-600 ring-1 ring-indigo-500/20 dark:text-indigo-300">
                        {i + 1}
                      </span>
                      <a href={`#${toSlug(c.title)}`} className="text-sm hover:underline">
                        {c.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground text-sm">No chapters listed.</p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}