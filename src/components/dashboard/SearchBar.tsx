"use client";

import React, { useState, useEffect, useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import type { SearchResults } from "@/types/types.searching";

type UiItem<TMeta = unknown> = {
  label: string;
  href: string;
  meta?: TMeta;
  key: string;
};

const API_PATH = "/api/search?q=";
const DEBOUNCE_MS = 300;
const MIN_CHARS = 1;
const MAX_UI_ITEMS = 50;

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, DEBOUNCE_MS);
  const [items, setItems] = useState<UiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // control Combobox visibility
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // cancel previous request
    abortRef.current?.abort();
    abortRef.current = null;
    setError(null);

    const q = debouncedQuery.trim();
    if (q.length < MIN_CHARS) {
      setItems([]);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);

    (async () => {
      try {
        const url = `${API_PATH}${encodeURIComponent(q)}`;
        const res = await fetch(url, { signal: ac.signal, cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Search failed (${res.status})`);
        }
        const body: { results: SearchResults[] } = await res.json();
        const ui: UiItem[] = body.results
          .slice(0, MAX_UI_ITEMS)
          .map((r) => ({
            label: r.label,
            href: r.href,
            meta: (r as unknown as { meta?: unknown }).meta,
            key: `${r.type}:${r.meta?.id ?? Math.random().toString(36).slice(2, 8)}`,
          }));
        setItems(ui);
        setIsOpen(ui.length > 0); // keep items visible until user clicks outside or selects
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return;
        console.error("Search error:", err);
        setError("Unable to search. Try again.");
        setItems([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, [debouncedQuery]);

  // Close popup when clicking outside or pressing Escape
  useEffect(() => {
    function handleDocClick(evt: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const target = evt.target as Node | null;
      if (!target) return;
      if (!el.contains(target)) {
        setIsOpen(false);
      }
    }
    function handleKey(evt: KeyboardEvent) {
      if (evt.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function clear() {
    setQuery("");
    // keep items until user clicks outside or new search happens
    setError(null);
    inputRef.current?.focus();
    setIsOpen(false);
  }

  // When the user selects an item we should close the dropdown but keep the items in memory
  function handleItemClick() {
    setIsOpen(false);
  }

  return (
    <Combobox as="div" className="relative w-full max-w-lg" nullable value={null} onChange={() => { }} >
      <div ref={containerRef} className="relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Combobox.Input
          ref={inputRef}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-colors text-sm"
          displayValue={() => query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
          }}
          onFocus={() => {
            // open if we already have items (retain previous results)
            if (items.length > 0) setIsOpen(true);
          }}
          placeholder="Search subjects, routines, events, exams..."
          aria-label="Global search"
        />
        {query ? (
          <button
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            type="button"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <Transition
        as={React.Fragment}
        show={isOpen}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <Combobox.Options
          static
          className="absolute mt-2 w-full rounded-xl border border-border bg-popover shadow-lg max-h-72 overflow-auto focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground text-sm">
              <Loader2 className="animate-spin w-4 h-4" />
              Searching...
            </div>
          ) : error ? (
            <div className="px-4 py-2 text-sm text-destructive">{error}</div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <Combobox.Option
                key={item.key}
                value={item}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 text-sm flex items-center gap-2 transition-colors ${active ? "bg-primary/5 text-primary" : "text-foreground"
                  }`
                }
              >
                <Link href={item.href} onClick={handleItemClick} className="w-full block">
                  <span className="truncate">{item.label}</span>
                </Link>
              </Combobox.Option>
            ))
          ) : (
            <div className="px-4 py-2 italic text-muted-foreground text-sm">No results found</div>
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
