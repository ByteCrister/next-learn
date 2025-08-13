"use client";

import { Badge } from "@/components/ui/badge";
import type { ExamResultDTO } from "@/types/types.exam";

export function ResultStatusBadge({ status }: { status: ExamResultDTO["status"] }) {
  switch (status) {
    case "submitted":
      return <Badge variant="default">Submitted</Badge>;
    case "in-progress":
      return <Badge variant="secondary">In progress</Badge>;
    case "late":
      return <Badge variant="outline" className="text-amber-600 border-amber-600/50">Late</Badge>;
    case "expired":
      return <Badge variant="outline" className="text-muted-foreground">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
