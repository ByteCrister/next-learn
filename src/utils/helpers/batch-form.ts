// format Date or ISO string to "yyyy-MM-dd" for <input type="date">
export function toInputDate(value?: string | Date | null): string | undefined {
    if (!value) return undefined;
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return undefined;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

// convert "yyyy-MM-dd" back to ISO string (midnight local)
export function fromInputDate(input?: string | null): string | undefined {
    if (!input) return undefined;
    // Keep it simple: interpret as local midnight and convert to ISO
    const [y, m, d] = input.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    const dt = new Date(y, m - 1, d);
    if (Number.isNaN(dt.getTime())) return undefined;
    return dt.toISOString();
}
