import { RoutineResponseDto } from '@/types/types.routine'

export function sortRoutines(
    arr: RoutineResponseDto[],
    key: 'name' | 'createdAt' | 'updatedAt',
    dir: 'asc' | 'desc'
) {
    const mul = dir === 'asc' ? 1 : -1
    return [...arr].sort((a, b) => {
        let av: string | number = ''
        let bv: string | number = ''
        if (key === 'name') {
            av = a.title.toLowerCase()
            bv = b.title.toLowerCase()
            return av < bv ? -1 * mul : av > bv ? 1 * mul : 0
        }
        if (key === 'createdAt') {
            av = new Date(a.createdAt).getTime()
            bv = new Date(b.createdAt).getTime()
        } else {
            av = new Date(a.updatedAt).getTime()
            bv = new Date(b.updatedAt).getTime()
        }
        return (av as number) - (bv as number) * mul
    })
}
