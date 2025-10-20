import { Card, CardContent } from "../ui/card";

// ---------- Shared ----------
export default function EmptyState({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action: React.ReactNode | null;
}) {
    return (
        <Card className="border-white/10 bg-white/5 dark:bg-zinc-900/40">
            <CardContent className="flex flex-col items-start gap-2 p-6">
                <p className="text-foreground font-medium">{title}</p>
                <p className="text-muted-foreground text-sm">{description}</p>
                {action}
            </CardContent>
        </Card>
    );
}