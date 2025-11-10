export default function TimePill({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
            {icon}
            <span className="font-medium">{label}:</span>
            <span>{value}</span>
        </div>
    );
}