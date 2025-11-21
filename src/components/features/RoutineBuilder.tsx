"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RoutineBuilder() {
    const routines = [
        { day: "Mon", subject: "DS", time: "9:00 AM" },
        { day: "Tue", subject: "ML", time: "10:00 AM" },
        { day: "Wed", subject: "Web", time: "2:00 PM" },
    ];

    return (
        <div className="space-y-3">
            {routines.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                    <Badge>{r.day}</Badge>
                    <span className="flex-1 font-medium">{r.subject}</span>
                    <span className="text-sm text-muted-foreground">{r.time}</span>
                </div>
            ))}
            <Button variant="outline" className="w-full">+ Add Routine</Button>
        </div>
    );
}
