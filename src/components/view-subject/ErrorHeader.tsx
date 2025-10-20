import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";

export default  function ErrorHeader({ onRetry, error }: { onRetry: () => void; error: string }) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">Unable to load subject</CardTitle>
        <p className="text-muted-foreground text-sm">{error}</p>
        <div className="pt-2">
          <Button onClick={onRetry} variant="default">
            Try again
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}