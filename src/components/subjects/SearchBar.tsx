// SearchBar.tsx
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";

export default function SearchBar({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative w-full max-w-sm group">
      <label htmlFor="search-input" className="sr-only">
        Search subjects
      </label>

      <AiOutlineSearch
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          text-gray-400 transition-colors
          group-focus-within:text-indigo-500
        "
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-indigo-500
            transition-colors
          "
        >
          <AiOutlineCloseCircle />
        </button>
      )}

      <input
        id="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search subjects…"
        className="
          block w-full
          pl-12 pr-12 py-2.5
          bg-gray-100 dark:bg-gray-700
          border border-gray-200 dark:border-gray-600
          rounded-lg
          text-gray-900 dark:text-gray-100 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          shadow-sm
          transition
        "
      />
    </div>
  );
}
