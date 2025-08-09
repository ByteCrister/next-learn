import { MdSort } from "react-icons/md";
import { AiOutlineDown } from "react-icons/ai";

type SortOption = "alpha-asc" | "alpha-desc" | "newest" | "oldest";

interface SortSelectProps {
    value: SortOption;
    options: { label: string; value: SortOption }[];
    onChange: (v: SortOption) => void;
}

export function SortSelect({ value, options, onChange }: SortSelectProps) {
    return (
        <div className="relative w-full max-w-xs">
            {/* Screen-reader only label */}
            <label htmlFor="sort-select" className="sr-only">
                Sort subjects
            </label>

            {/* Left icon */}
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
                <MdSort className="text-gray-400 text-lg" />
            </div>

            {/* Right arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 pr-4 flex items-center">
                <AiOutlineDown className="text-gray-400 text-lg" />
            </div>

            {/* Select */}
            <select
                id="sort-select"
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="
          block w-full
          appearance-none
          pl-12 pr-12 py-3
          bg-white bg-opacity-40 backdrop-blur-md
          border border-transparent
          rounded-xl
          shadow-sm
          text-gray-900
          focus:bg-opacity-60
          focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition duration-200
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
