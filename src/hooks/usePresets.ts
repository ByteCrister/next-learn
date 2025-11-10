'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type PresetKind = 'subject' | 'teacher' | 'room'

export interface PresetItem {
    id: string
    kind: PresetKind
    label: string
    meta?: string
    createdAt: string
}

export interface DeletedPresetItem extends PresetItem {
    deletedAt: string
    deletedBy?: string
}

function uid() {
    return Math.random().toString(36).slice(2, 9)
}

/**
 * usePresets with recycle bin (in-memory, route-scoped)
 */
type Store = {
    active: PresetItem[]
    deleted: DeletedPresetItem[]
}

const globalRouteStores = new Map<string, Store>()

export function usePresets(routeKey = '__default__', initialItems?: PresetItem[]) {
    const keyRef = useRef(routeKey)

    useEffect(() => {
        const existing = globalRouteStores.get(routeKey)
        if (!existing) {
            globalRouteStores.set(routeKey, {
                active: initialItems ? [...initialItems] : [],
                deleted: [],
            })
        } else if (Array.isArray(existing)) {
            // migrate legacy array -> object shape
            globalRouteStores.set(routeKey, {
                active: [...existing],
                deleted: [],
            })
        } else {
            // existing already in new shape; if initialItems provided and active empty, seed it
            if (initialItems && (!existing.active || existing.active.length === 0)) {
                globalRouteStores.set(routeKey, {
                    active: [...initialItems],
                    deleted: existing.deleted ?? [],
                })
            }
        }
        keyRef.current = routeKey
    }, [routeKey, initialItems])


    const [state, setState] = useState<Store>(() => {
        const s = globalRouteStores.get(routeKey)
        if (!s) return { active: initialItems ? [...initialItems] : [], deleted: [] }
        if (Array.isArray(s)) return { active: [...s], deleted: [] }
        return { active: [...s.active], deleted: [...s.deleted ?? []] }
    })

    useEffect(() => {
        const store = globalRouteStores.get(routeKey) ?? { active: [], deleted: [] }
        setState({ active: [...store.active], deleted: [...store.deleted] })
        keyRef.current = routeKey
    }, [routeKey])

    const writeBack = useCallback((next: Store) => {
        globalRouteStores.set(keyRef.current, { active: [...next.active], deleted: [...next.deleted] })
        setState({ active: [...next.active], deleted: [...next.deleted] })
    }, [])

    const add = useCallback(
        (kind: PresetKind, label: string, meta?: string) => {
            const trimmed = label.trim()
            if (!trimmed) return null
            const store = globalRouteStores.get(keyRef.current) ?? { active: [], deleted: [] }
            // dedupe active same-kind labels
            const exists = store.active.find((it) => it.kind === kind && it.label.toLowerCase() === trimmed.toLowerCase())
            if (exists) {
                // refresh local state
                setState({ active: [...store.active], deleted: [...store.deleted] })
                return exists
            }
            const item: PresetItem = { id: uid(), kind, label: trimmed, meta, createdAt: new Date().toISOString() }
            const next: Store = { active: [item, ...store.active], deleted: [...store.deleted] }
            writeBack(next)
            return item
        },
        [writeBack]
    )

    const update = useCallback(
        (id: string, patch: Partial<Omit<PresetItem, 'id'>>) => {
            const store = globalRouteStores.get(keyRef.current) ?? { active: [], deleted: [] }
            const nextActive = store.active.map((it) => (it.id === id ? { ...it, ...patch } : it))
            writeBack({ active: nextActive, deleted: [...store.deleted] })
        },
        [writeBack]
    )

    // soft-delete: move item from active -> deleted with deletedAt
    const softDelete = useCallback(
        (id: string, deletedBy?: string) => {
            const store = globalRouteStores.get(keyRef.current) ?? { active: [], deleted: [] }
            const target = store.active.find((it) => it.id === id)
            if (!target) return
            const deletedItem: DeletedPresetItem = { ...target, deletedAt: new Date().toISOString(), deletedBy }
            const next: Store = {
                active: store.active.filter((it) => it.id !== id),
                deleted: [deletedItem, ...store.deleted],
            }
            writeBack(next)
        },
        [writeBack]
    )

    // restore: move from deleted -> active (push to front)
    const restore = useCallback(
        (id: string) => {
            const store = globalRouteStores.get(keyRef.current) ?? { active: [], deleted: [] }
            const target = store.deleted.find((it) => it.id === id)
            if (!target) return
            const restored: PresetItem = { id: target.id, kind: target.kind, label: target.label, meta: target.meta, createdAt: target.createdAt }
            const next: Store = { active: [restored, ...store.active], deleted: store.deleted.filter((it) => it.id !== id) }
            writeBack(next)
        },
        [writeBack]
    )

    // permanently delete from deleted store
    const purge = useCallback(
        (id: string) => {
            const store = globalRouteStores.get(keyRef.current) ?? { active: [], deleted: [] }
            const next: Store = { active: [...store.active], deleted: store.deleted.filter((it) => it.id !== id) }
            writeBack(next)
        },
        [writeBack]
    )

    const remove = useCallback(
        // legacy name kept for compatibility: perform softDelete by default
        (id: string) => {
            softDelete(id)
        },
        [softDelete]
    )

    const listByKind = useCallback((kind: PresetKind) => state.active.filter((it) => it.kind === kind), [state.active])
    const listDeleted = useCallback((kind?: PresetKind) => (kind ? state.deleted.filter((it) => it.kind === kind) : state.deleted), [state.deleted])
    const listAll = useCallback(() => state.active, [state.active])

    const api = useMemo(
        () => ({
            items: state.active,
            deleted: state.deleted,
            add,
            update,
            remove, // soft-delete
            softDelete,
            restore,
            purge,
            listByKind,
            listDeleted,
            listAll,
        }),
        [state.active, state.deleted, add, update, remove, softDelete, restore, purge, listByKind, listDeleted, listAll]
    )

    return api
}
