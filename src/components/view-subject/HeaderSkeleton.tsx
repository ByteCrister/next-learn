import { Card, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function HeaderSkeleton() {
  return (
    <Card className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md dark:bg-zinc-900/40">
      <CardHeader>
        <div className="space-y-3">
          <Skeleton className="h-7 w-64 bg-neutral-300" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 bg-neutral-200" />
            <Skeleton className="h-6 w-28 bg-neutral-200" />
            <Skeleton className="h-6 w-36 bg-neutral-200" />
          </div>
          <Separator className="my-2" />
          <Skeleton className="h-4 w-full bg-neutral-300" />
          <Skeleton className="h-4 w-2/3 bg-neutral-300" />
        </div>
      </CardHeader>
    </Card>
  );
}
