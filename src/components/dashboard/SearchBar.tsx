"use client";

import { useState, useEffect, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import Link from "next/link";

interface SearchItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

// Simulated API call
const mockApiSearch = (query: string): Promise<SearchItem[]> =>
  new Promise((resolve) =>
    setTimeout(() => {
      const demoItems: SearchItem[] = [
        { label: "Dashboard Overview", href: "/dashboard" },
        { label: "Subjects List", href: "/subjects" },
        { label: "My Routines", href: "/routines" },
        { label: "Upcoming Exams", href: "/exams" },
      ];
      resolve(
        demoItems.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 400)
  );

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    mockApiSearch(debouncedQuery).then((items) => {
      setResults(items);
      setLoading(false);
    });
  }, [debouncedQuery]);

  return (
    <Combobox as="div" className="relative w-full max-w-sm">
      {/* Input Field */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />

        <Combobox.Input
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground
                     placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50
                     focus:ring-offset-2 focus:ring-offset-background transition-colors text-sm"
          displayValue={() => query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
        afterLeave={() => setResults([])}
      >
        <Combobox.Options
          static
          className="absolute mt-2 w-full rounded-xl border border-border bg-popover shadow-lg max-h-60 
                     overflow-auto focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground text-sm">
              <Loader2 className="animate-spin w-4 h-4" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <Combobox.Option
                key={item.href}
                value={item}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 text-sm flex items-center gap-2 transition-colors
                   ${active ? "bg-primary/5 text-primary" : "text-foreground"}`
                }
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <Link href={item.href} onClick={() => setQuery("")}>
                  {item.label}
                </Link>
              </Combobox.Option>
            ))
          ) : (
            <div className="px-4 py-2 italic text-muted-foreground text-sm">
              No results found
            </div>
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
