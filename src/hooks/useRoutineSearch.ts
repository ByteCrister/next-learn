// hooks/useRoutineSearch.ts
import { useState, useMemo, useCallback, useEffect } from 'react'
import Fuse from 'fuse.js'
import { RoutineResponseDto } from '@/types/types.routine'
import debounce from 'lodash.debounce'

interface UseRoutineSearchOptions {
    routines: RoutineResponseDto[]
    keys?: Array<keyof RoutineResponseDto | string>
    debounceTime?: number
}

export const useRoutineSearch = ({
    routines,
    keys = ['title', 'description', 'days.slots.subject', 'days.slots.teacher', 'days.slots.room'],
    debounceTime = 300,
}: UseRoutineSearchOptions) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<RoutineResponseDto[]>(routines)

    useEffect(() => {
        setResults(routines);
    }, [routines]);

    const fuse = useMemo(
        () =>
            new Fuse(routines, {
                keys,
                threshold: 0.3,
            }),
        [routines, keys]
    )

    // Debounce inside useMemo (dependencies tracked properly)
    const performSearch = useMemo(
        () =>
            debounce((searchText: string) => {
                if (!searchText) {
                    setResults(routines)
                    return
                }
                const fuseResults = fuse.search(searchText)
                setResults(fuseResults.map((res) => res.item))
            }, debounceTime),
        [fuse, routines, debounceTime]
    )

    // Cancel debounce on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            performSearch.cancel();
        }
    }, [performSearch]);

    // Wrapper callback
    const onSearch = useCallback(
        (searchText: string) => {
            setQuery(searchText)
            performSearch(searchText)
        },
        [performSearch]
    )

    return { query, results, onSearch }
}
