import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";

export default function SearchBar({ value, onChange, onClear }: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative w-full max-w-md">
      {/* Accessible label */}
      <label htmlFor="search-input" className="sr-only">
        Search subjects
      </label>

      {/* Search icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
        <AiOutlineSearch className="text-gray-400 text-lg" />
      </div>

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
          aria-label="Clear search"
        >
          <AiOutlineCloseCircle className="text-lg" />
        </button>
      )}

      {/* Input */}
      <input
        id="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search subjects…"
        aria-label="Search subjects"
        className="
          block w-full
          pl-12 pr-12 py-3
          bg-white bg-opacity-40 backdrop-blur-md
          border border-transparent
          rounded-xl
          shadow-sm
          placeholder-gray-500 text-gray-900
          focus:bg-opacity-60
          focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition duration-200
        "
      />
    </div>
  );
}
