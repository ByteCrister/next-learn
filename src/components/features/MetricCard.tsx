import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
    label: string;
    value: string;
    trend: string;
}

export default function MetricCard({ label, value, trend }: MetricCardProps) {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-card">
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <Badge variant="secondary" className="text-base">{trend}</Badge>
        </div>
    );
}