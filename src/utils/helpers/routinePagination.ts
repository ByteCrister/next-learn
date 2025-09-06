export function paginate<T>(items: T[], page: number, size: number) {
    const total = items.length
    const totalPages = Math.max(1, Math.ceil(total / size))
    const current = Math.min(Math.max(1, page), totalPages)
    const start = (current - 1) * size
    const end = start + size
    return {
        items: items.slice(start, end),
        totalPages,
    }
}
