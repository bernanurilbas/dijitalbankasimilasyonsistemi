import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '' 
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-white/10 rounded-lg text-brand-textSecondary hover:text-brand-textPrimary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/[0.02]"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      {pages.map((p) => {
        const isCurrent = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 text-sm font-semibold rounded-lg border transition-all ${isCurrent ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-blue-500/10' : 'border-white/10 text-brand-textSecondary hover:text-brand-textPrimary hover:bg-white/[0.02]'}`}
          >
            {p}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-white/10 rounded-lg text-brand-textSecondary hover:text-brand-textPrimary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/[0.02]"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
