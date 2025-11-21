export default function MiniCalendar() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const events = [2, 0, 1, 3, 1, 0, 0];

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, i) => (
                    <div key={i} className="text-center">
                        <p className="text-xs text-muted-foreground mb-2">{day}</p>
                        <div className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium ${events[i] > 0 ? 'bg-primary/10 border-primary/30' : 'bg-muted/50'
                            }`}>
                            {events[i] > 0 && <span className="text-primary">{events[i]}</span>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>7 events this week</span>
            </div>
        </div>
    );
}
