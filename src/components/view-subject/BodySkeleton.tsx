import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function BodySkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Skeleton className="h-9 w-28 bg-neutral-200" />
                <Skeleton className="h-9 w-28 bg-neutral-200" />
                <Skeleton className="h-9 w-28 bg-neutral-200" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-24 bg-neutral-200" />
                        <Skeleton className="h-4 w-full bg-neutral-200" />
                        <Skeleton className="h-4 w-2/3 bg-neutral-300" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-24 bg-neutral-200" />
                        <Skeleton className="h-4 w-full bg-neutral-200" />
                        <Skeleton className="h-4 w-2/3 bg-neutral-300" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-24 bg-neutral-200" />
                        <Skeleton className="h-4 w-full bg-neutral-200" />
                        <Skeleton className="h-4 w-2/3 bg-neutral-300" />
                    </div>
                </Card>
            </div>

            <Card className="p-4">
                <Skeleton className="mb-2 h-5 w-40 bg-neutral-200" />
                <Skeleton className="h-4 w-full bg-neutral-200" />
                <Skeleton className="h-4 w-[85%] bg-neutral-200" />
                <Skeleton className="h-4 w-[70%] bg-neutral-200" />
            </Card>
        </div>
    );
}
