import { CourseRoadmapDTO } from "@/types/types.view.subject";
import EmptyState from "./EmptyState";
import {motion} from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toSlug } from "@/utils/helpers/toSlug";
import HtmlContent from "../global/HtmlContent";

export default function ChaptersSection({ roadmap }: { roadmap: CourseRoadmapDTO | null }) {
  if (!roadmap || !roadmap.chapters?.length) {
    return (
      <EmptyState
        title="No chapters yet"
        description="Chapters will appear here once they’re added."
        action={null}
      />
    );
  }

  return (
    <div className="space-y-4">
      {roadmap.chapters.map((ch, idx) => (
        <motion.div key={ch._id?.toString() ?? ch.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card id={toSlug(ch.title)} className="group border-white/10 bg-white/5 transition-shadow hover:shadow-md hover:shadow-violet-500/10 dark:bg-zinc-900/40">
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-base">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/15 text-xs font-semibold text-violet-600 ring-1 ring-violet-500/20 dark:text-violet-300">
                  {idx + 1}
                </span>
                {ch.title}
              </CardTitle>
              <a
                href={`#${toSlug(ch.title)}`}
                className="text-muted-foreground text-xs hover:text-foreground"
                aria-label={`Link to ${ch.title}`}
              >
                #
              </a>
            </CardHeader>
            <CardContent className="pt-0">
              <HtmlContent html={ch.content} />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}