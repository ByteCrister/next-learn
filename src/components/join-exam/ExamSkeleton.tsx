import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ExamSkeleton() {
  return (
    <div className="mx-auto my-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-neutral-300" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-64 bg-neutral-200" />
          <Skeleton className="h-4 w-40 bg-neutral-200" />
          <Skeleton className="h-6 w-32 bg-neutral-200" />
        </CardContent>
      </Card>

      {[...Array(3)].map((_, idx) => (
        <Card key={idx}>
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-neutral-300" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4 bg-neutral-200" />
            <div className="grid gap-2 sm:grid-cols-2">
              {[...Array(4)].map((__, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-full rounded-md bg-neutral-200"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24 rounded-md bg-neutral-200" />
        <Skeleton className="h-10 w-36 rounded-md bg-neutral-200" />
      </div>
    </div>
  );
}
