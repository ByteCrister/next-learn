// SortSelect.tsx
import { MdSort } from "react-icons/md";
import { AiOutlineDown } from "react-icons/ai";
import { SortOption } from "./Subjects";


interface SortSelectProps {
  value: SortOption;
  options: { label: string; value: SortOption }[];
  onChange: (v: SortOption) => void;
}

export function SortSelect({
  value,
  options,
  onChange,
}: SortSelectProps) {
  return (
    <div className="relative w-full max-w-xs group">
      <label htmlFor="sort-select" className="sr-only">
        Sort subjects
      </label>

      <MdSort
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          text-gray-400 transition-colors
          group-focus-within:text-indigo-500
        "
      />

      <AiOutlineDown
        className="
          absolute right-4 top-1/2 -translate-y-1/2
          text-gray-400
        "
      />

      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="
          block w-full appearance-none
          pl-12 pr-12 py-2.5
          bg-gray-100 dark:bg-gray-700
          border border-gray-200 dark:border-gray-600
          rounded-lg
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          shadow-sm
          transition
        "
      >
        {options.map(({ label, value: v }) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
