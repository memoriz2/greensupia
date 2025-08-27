"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Inquiry {
  id: number;
  title: string;
  content: string;
  author: string;
  isSecret: boolean;
  isAnswered: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InquiryListResponse {
  success: boolean;
  data: Inquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

export default function PortalInquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<
    "all" | "pending" | "answered" | "secret" | "public"
  >("all");

  const loadInquiries = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (filter !== "all") {
        if (filter === "pending") {
          params.append("isAnswered", "false");
        } else if (filter === "answered") {
          params.append("isAnswered", "true");
        } else if (filter === "secret") {
          params.append("isSecret", "true");
        } else if (filter === "public") {
          params.append("isSecret", "false");
        }
      }

      const response = await fetch(`/api/inquiries?${params}`);

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data: InquiryListResponse = await response.json();

      if (data.success) {
        setInquiries(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error("문의글 목록을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("서버 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">문의글 관리</h2>
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="portal space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">문의글 관리</h1>
      </div>

      <div className="card">
        {/* 필터 버튼들 */}
        <div className="filter-section">
          <button
            onClick={() => handleFilterChange("all")}
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
          >
            전체
          </button>
          <button
            onClick={() => handleFilterChange("pending")}
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          >
            답변 대기
          </button>
          <button
            onClick={() => handleFilterChange("answered")}
            className={`filter-btn ${filter === "answered" ? "active" : ""}`}
          >
            답변 완료
          </button>
          <button
            onClick={() => handleFilterChange("secret")}
            className={`filter-btn ${filter === "secret" ? "active" : ""}`}
          >
            비밀글
          </button>
          <button
            onClick={() => handleFilterChange("public")}
            className={`filter-btn ${filter === "public" ? "active" : ""}`}
          >
            공개글
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>상태</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    등록된 문의글이 없습니다.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        {inquiry.isAnswered ? (
                          <span className="status-badge active">
                            ✅ 답변완료
                          </span>
                        ) : (
                          <span className="status-badge inactive">
                            ⏳ 대기중
                          </span>
                        )}
                        {inquiry.isSecret && (
                          <span className="status-badge warning">
                            🔒 비밀글
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="max-w-xs truncate font-medium">
                      <Link
                        href={`/portal/inquiry/${inquiry.id}`}
                        className="inquiry-link"
                      >
                        {inquiry.title}
                      </Link>
                    </td>
                    <td>{inquiry.author}</td>
                    <td>{formatDate(inquiry.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/portal/inquiry/${inquiry.id}`}
                          className="btn btn-sm btn-outline"
                        >
                          상세보기
                        </Link>
                        {!inquiry.isAnswered && (
                          <Link
                            href={`/portal/inquiry/${inquiry.id}/answer`}
                            className="btn btn-sm btn-primary"
                          >
                            답변하기
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="pagination-section">
            <nav className="pagination-nav">
              <ul className="pagination-list">
                {currentPage > 1 && (
                  <li>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="pagination-btn"
                    >
                      이전
                    </button>
                  </li>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-btn ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

                {currentPage < totalPages && (
                  <li>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="pagination-btn"
                    >
                      다음
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
