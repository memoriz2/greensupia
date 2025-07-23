"use client";

import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5,
}: PaginationProps) {
  // hoveredPage는 향후 호버 효과 구현을 위해 유지
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxPageNumbers) {
      // 전체 페이지가 maxPageNumbers보다 작으면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변의 페이지들 표시
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxPageNumbers / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

      // 첫 페이지 추가
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      // 중간 페이지들 추가
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // 마지막 페이지 추가
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination">
      {/* 페이지 정보 */}
      <div className="pagination__info">
        <span className="text-sm text-gray-600">
          {totalItems > 0 ? `${startItem}-${endItem}` : "0"} / {totalItems}개
        </span>
      </div>

      {/* 페이지네이션 컨트롤 */}
      <div className="pagination__controls">
        {/* 이전 버튼 */}
        <button
          className={`pagination__button pagination__button--prev ${
            currentPage === 1 ? "pagination__button--disabled" : ""
          }`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
        >
          <span>‹</span>
        </button>

        {/* 페이지 번호들 */}
        {showPageNumbers && (
          <div className="pagination__numbers">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`pagination__button pagination__button--number ${
                  page === currentPage ? "pagination__button--active" : ""
                } ${page === "..." ? "pagination__button--ellipsis" : ""}`}
                onClick={() =>
                  typeof page === "number" && handlePageClick(page)
                }
                disabled={page === "..."}
                onMouseEnter={() =>
                  typeof page === "number" && setHoveredPage(page)
                }
                onMouseLeave={() => setHoveredPage(null)}
                aria-label={page === "..." ? "페이지 생략" : `${page}페이지`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* 다음 버튼 */}
        <button
          className={`pagination__button pagination__button--next ${
            currentPage === totalPages ? "pagination__button--disabled" : ""
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          aria-label="다음 페이지"
        >
          <span>›</span>
        </button>
      </div>
    </div>
  );
}
