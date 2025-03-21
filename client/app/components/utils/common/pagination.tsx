import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-blue-600 text-white rounded-md disabled:bg-gray-300"
      >
        Previous
      </button>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages} | Total Records: {totalItems}
        </span>
      </div>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 bg-blue-600 text-white rounded-md disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
