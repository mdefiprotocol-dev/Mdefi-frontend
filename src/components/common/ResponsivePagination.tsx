import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ResponsivePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  showItemCount?: boolean;
}

export const ResponsivePagination: React.FC<ResponsivePaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
  showItemCount = false,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  // If there are no items or only 1 page, do not unnecessarily display pagination
  if (totalPages <= 1) {
    return null;
  }

  // Generate pagination items with smart ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (currentPage <= 3) {
      pages.push(1, 2, 3);
      if (totalPages > 4) {
        pages.push('...');
      }
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage, '...', totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 pt-3 select-none w-full min-w-0 max-w-full overflow-hidden ${className}`}
    >
      {/* Record Counter Info (Optional helper) */}
      {showItemCount ? (
        <div className="text-[11px] font-mono text-zinc-400 text-center sm:text-left truncate max-w-full">
          Showing <span className="text-zinc-200 font-semibold">{startRecord}–{endRecord}</span> of{' '}
          <span className="text-emerald-400 font-semibold">{totalItems}</span> records
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* Main Pagination Controls Bar */}
      <div className="inline-flex items-center gap-0.5 sm:gap-1.5 p-1 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 shadow-[0_0_20px_rgba(0,0,0,0.35)] backdrop-blur-md max-w-full overflow-x-auto">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="h-7.5 sm:h-8.5 px-2 sm:px-3 rounded-xl text-xs font-mono font-medium transition-all text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shrink-0 active:scale-95"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[2.2]" />
          <span className="text-[11px] whitespace-nowrap">Previous</span>
        </button>

        {/* Page Buttons & Ellipsis */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === '...' || typeof page === 'string') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-5 sm:w-8 h-7.5 sm:h-8.5 flex items-center justify-center text-[10px] sm:text-xs font-mono text-zinc-600 select-none"
                >
                  •••
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`min-w-7.5 h-7.5 sm:min-w-8.5 sm:h-8.5 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95 ${
                  isCurrent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className="h-7.5 sm:h-8.5 px-2 sm:px-3 rounded-xl text-xs font-mono font-medium transition-all text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shrink-0 active:scale-95"
        >
          <span className="text-[11px]">Next</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>
    </nav>
  );
};
