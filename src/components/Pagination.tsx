import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`
          p-2 rounded-lg 
          ${currentPage === 1 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
          }
        `}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex space-x-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-10 h-10 rounded-lg 
              transition-colors duration-200 
              ${page === currentPage 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'text-gray-600 hover:bg-blue-50'
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`
          p-2 rounded-lg 
          ${currentPage === totalPages 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
          }
        `}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;