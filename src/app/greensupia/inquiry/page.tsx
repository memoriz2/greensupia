"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Inquiry {
  id: number;
  title: string;
  author: string;
  isSecret: boolean;
  isAnswered: boolean;
  createdAt: string;
}

interface InquiryListResponse {
  success: boolean;
  data: Inquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function InquiryListPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    isAnswered: "",
    isSecret: "",
  });

  // 문의글 목록 로드
  const loadInquiries = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          ...(filters.isAnswered && { isAnswered: filters.isAnswered }),
          ...(filters.isSecret && { isSecret: filters.isSecret }),
        });

        const response = await fetch(`/api/inquiries?${params}`);
        if (response.ok) {
          const data: InquiryListResponse = await response.json();
          setInquiries(data.data);
          setPagination(data.pagination);
        } else {
          console.error("문의글 목록을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error("문의글 목록을 불러오는 중 오류가 발생했습니다:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const handlePageChange = (newPage: number) => {
    loadInquiries(newPage);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="inquiry-list">
      <header className="inquiry-list__header">
        <h1>문의글 목록</h1>
        <p>고객님들의 문의사항을 확인하실 수 있습니다.</p>
      </header>

      <section className="inquiry-list__controls">
        <div className="inquiry-list__filters">
          <div className="inquiry-list__filter">
            <label
              htmlFor="answerFilter"
              className="inquiry-list__filter-label"
            >
              답변 상태
            </label>
            <select
              id="answerFilter"
              value={filters.isAnswered}
              onChange={(e) => handleFilterChange("isAnswered", e.target.value)}
              className="inquiry-list__filter-select"
            >
              <option value="">전체</option>
              <option value="false">답변 대기</option>
              <option value="true">답변 완료</option>
            </select>
          </div>

          <div className="inquiry-list__filter">
            <label
              htmlFor="secretFilter"
              className="inquiry-list__filter-label"
            >
              글 유형
            </label>
            <select
              id="secretFilter"
              value={filters.isSecret}
              onChange={(e) => handleFilterChange("isSecret", e.target.value)}
              className="inquiry-list__filter-select"
            >
              <option value="">전체</option>
              <option value="false">일반글</option>
              <option value="true">비밀글</option>
            </select>
          </div>
        </div>

        <Link
          href="/greensupia/inquiry/write"
          className="inquiry-list__write-button"
        >
          문의글 작성
        </Link>
      </section>

      <section className="inquiry-list__content">
        {isLoading ? (
          <div className="inquiry-list__loading">
            <p>문의글을 불러오는 중입니다...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="inquiry-list__empty">
            <p>등록된 문의글이 없습니다.</p>
            <Link
              href="/greensupia/inquiry/write"
              className="inquiry-list__write-link"
            >
              첫 번째 문의글을 작성해보세요
            </Link>
          </div>
        ) : (
          <>
            <div className="inquiry-list__table-container">
              <table className="inquiry-list__table">
                <thead>
                  <tr>
                    <th scope="col">번호</th>
                    <th scope="col">제목</th>
                    <th scope="col">작성자</th>
                    <th scope="col">작성일</th>
                    <th scope="col">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="inquiry-list__row">
                      <td className="inquiry-list__cell inquiry-list__cell--id">
                        {inquiry.id}
                      </td>
                      <td className="inquiry-list__cell inquiry-list__cell--title">
                        <Link
                          href={`/greensupia/inquiry/${inquiry.id}`}
                          className="inquiry-list__title-link"
                        >
                          {inquiry.title}
                          {inquiry.isSecret && (
                            <span className="inquiry-list__secret-badge">
                              🔒
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="inquiry-list__cell inquiry-list__cell--author">
                        {inquiry.author}
                      </td>
                      <td className="inquiry-list__cell inquiry-list__cell--date">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="inquiry-list__cell inquiry-list__cell--status">
                        <span
                          className={`inquiry-list__status-badge ${
                            inquiry.isAnswered
                              ? "inquiry-list__status-badge--answered"
                              : "inquiry-list__status-badge--pending"
                          }`}
                        >
                          {inquiry.isAnswered ? "답변완료" : "답변대기"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <nav
                className="inquiry-list__pagination"
                aria-label="페이지 네비게이션"
              >
                <ul className="inquiry-list__pagination-list">
                  {pagination.page > 1 && (
                    <li>
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="inquiry-list__pagination-button"
                        aria-label="이전 페이지"
                      >
                        이전
                      </button>
                    </li>
                  )}

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (pageNum) =>
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.page) <= 2
                    )
                    .map((pageNum, index, array) => (
                      <li key={pageNum}>
                        {index > 0 && array[index - 1] !== pageNum - 1 && (
                          <span className="inquiry-list__pagination-ellipsis">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => handlePageChange(pageNum)}
                          className={`inquiry-list__pagination-button ${
                            pageNum === pagination.page
                              ? "inquiry-list__pagination-button--active"
                              : ""
                          }`}
                          aria-current={
                            pageNum === pagination.page ? "page" : undefined
                          }
                        >
                          {pageNum}
                        </button>
                      </li>
                    ))}

                  {pagination.page < pagination.totalPages && (
                    <li>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="inquiry-list__pagination-button"
                        aria-label="다음 페이지"
                      >
                        다음
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
