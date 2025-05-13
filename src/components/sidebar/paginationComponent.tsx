import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số lượng nút trang hiển thị tối đa

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang ít, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Nếu nhiều trang, hiển thị thông minh xung quanh trang hiện tại
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Điều chỉnh nếu cần
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      // Thêm trang đầu tiên
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      // Thêm các trang giữa
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Thêm trang cuối cùng
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Xử lý khi nhấp vào nút trang
  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center mt-6 mb-4">
      <div className="flex items-center space-x-1">
        {/* Nút Previous */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center px-3 py-2 rounded-md border ${
            currentPage === 1
              ? "text-gray-300 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Các nút số trang */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            className={`px-4 py-2 rounded-md ${
              page === currentPage
                ? "bg-red-600 text-white"
                : page === "..."
                ? "text-gray-500"
                : "text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}

        {/* Nút Next */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center px-3 py-2 rounded-md border ${
            currentPage === totalPages
              ? "text-gray-300 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;