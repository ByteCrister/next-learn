// hooks/useDebouncedCallback.ts
import { useRef, useCallback, useEffect } from "react";

/**
 * Strongly-typed debounced callback hook.
 * - T is the function type you want to debounce
 * - returned callback has signature (...args: Parameters<T>) => void
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, wait = 250) {
    const timer = useRef<number | undefined>(undefined);
    const saved = useRef<T>(fn);

    // keep latest fn reference
    useEffect(() => {
        saved.current = fn;
    }, [fn]);

    const callback = useCallback((...args: Parameters<T>) => {
        if (timer.current) {
            window.clearTimeout(timer.current);
        }
        // schedule the latest saved fn with the provided args
        timer.current = window.setTimeout(() => {
            saved.current(...args);
        }, wait);
    }, [wait]);

    const cancel = useCallback(() => {
        if (timer.current) {
            window.clearTimeout(timer.current);
            timer.current = undefined;
        }
    }, []);

    // clear on unmount
    useEffect(() => cancel, [cancel]);

    return Object.assign(callback, { cancel }) as ((...args: Parameters<T>) => void) & { cancel: () => void };
}

export default useDebouncedCallback;
