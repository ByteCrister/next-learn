export default function DashboardPreview() {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Subjects</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Routines</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-muted-foreground">Exams</p>
                </div>
            </div>
        </div>
    );
}