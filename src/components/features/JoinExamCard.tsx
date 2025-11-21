export default function JoinExamCard() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-8 rounded-xl border-2 bg-card space-y-6 text-center">
                <div className="text-5xl">🔗</div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">Join with a link</h3>
                    <p className="text-muted-foreground">
                        Educators can share exam links. Simply paste the URL to join and start.
                    </p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Paste exam link here..."
                        className="flex-1 px-4 py-3 rounded-lg border-2 bg-background"
                    />
                    <button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
}
