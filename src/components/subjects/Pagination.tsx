"use client";

import { FC } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="inline-flex space-x-2 items-center justify-center mt-6"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-disabled={currentPage === 1}
        aria-label="Previous page"
        className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-disabled={currentPage === totalPages}
        aria-label="Next page"
        className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
};
