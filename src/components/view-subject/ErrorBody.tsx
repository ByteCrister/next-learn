import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function ErrorBody({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">Couldn&apos;t load content</p>
            <p className="text-muted-foreground text-sm">Please check your connection and try again.</p>
          </div>
          <Button onClick={onRetry}>Retry</Button>
        </div>
      </CardContent>
    </Card>
  );
}