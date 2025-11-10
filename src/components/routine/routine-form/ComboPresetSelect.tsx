'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { usePresets, PresetKind, PresetItem } from '@/hooks/usePresets'
import { Input } from '@/components/ui/input'
import { FiChevronDown, FiSearch, FiPlus } from 'react-icons/fi'

export type ComboValue = {
    presetId?: string | null
    text: string
}

export function ComboPresetSelect({ kind, value, onChange, allowCreate = true, placeholder, routeKey = '__default__' }: {
    kind: PresetKind
    value: ComboValue
    onChange: (v: ComboValue) => void
    allowCreate?: boolean
    placeholder?: string
    routeKey?: string
}) {
    const { listByKind, add } = usePresets(routeKey)
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)

    const items = listByKind(kind)

    useEffect(() => {
        setQuery(value.text ?? '')
    }, [value.text])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return items
        return items.filter((it) => it.label.toLowerCase().includes(q))
    }, [items, query])

    const onSelectPreset = (it: PresetItem) => {
        onChange({ presetId: it.id, text: it.label })
        setOpen(false)
    }

    const onEnterCreate = async () => {
        const trimmed = query.trim()
        if (!trimmed) return
        if (!allowCreate) {
            onChange({ presetId: undefined, text: trimmed })
            setOpen(false)
            return
        }
        const created = add(kind, trimmed)
        // add returns PresetItem or null; if null, user typed duplicate label,
        // find existing item
        if (created) {
            onChange({ presetId: created.id, text: created.label })
        } else {
            const existing = items.find((it) => it.label.toLowerCase() === trimmed.toLowerCase())
            if (existing) onChange({ presetId: existing.id, text: existing.label })
            else onChange({ presetId: undefined, text: trimmed })
        }
        setOpen(false)
    }

    return (
        <div className="relative w-full">
            <div className="flex items-center gap-2">
                <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); onChange({ presetId: undefined, text: e.target.value }) }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            onEnterCreate()
                        } else if (e.key === 'Escape') {
                            setOpen(false)
                        }
                    }}
                    placeholder={placeholder}
                />
                <button type="button" onClick={() => setOpen((s) => !s)} className="px-2 py-2 rounded bg-slate-100">
                    <FiChevronDown />
                </button>
            </div>

            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white border rounded shadow max-h-48 overflow-auto">
                    <div className="px-3 py-2 border-b flex items-center gap-2">
                        <FiSearch className="text-slate-400" />
                        <div className="text-sm text-slate-500">Choose or type to create</div>
                    </div>

                    <div className="p-2 space-y-1">
                        {filtered.length === 0 ? (
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-500">No presets found</div>
                                {allowCreate && (
                                    <button onClick={onEnterCreate} className="flex items-center gap-2 px-2 py-1 rounded bg-indigo-600 text-white text-sm">
                                        <FiPlus /> Create
                                    </button>
                                )}
                            </div>
                        ) : (
                            filtered.map((it) => (
                                <div
                                    key={it.id}
                                    onClick={() => onSelectPreset(it)}
                                    role="button"
                                    tabIndex={0}
                                    className="px-3 py-2 rounded hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                                >
                                    <div className="text-sm">{it.label}</div>
                                    <div className="text-xs text-slate-400">{new Date(it.createdAt).toLocaleDateString()}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
