"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Notice } from "@/types/notice";
import Pagination from "@/components/Pagination";

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchNotices = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notices?page=${pageNum}&limit=10`);
      const result = await response.json();

      if (result.success) {
        setNotices(result.data.notices);
        setTotal(result.data.total);
        setTotalPages(Math.ceil(result.data.total / 10));
      }
    } catch (error) {
      console.error("공지사항 불러오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(page);
  }, [page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">공지사항을 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="greensupia-notice">
      <Header />

      <main className="greensupia-notice__container">
        {/* 페이지 헤더 */}
        <div className="greensupia-notice__header">
          <div className="greensupia-notice__header-content">
            <h1 className="greensupia-notice__title">공지사항</h1>
            <p className="greensupia-notice__description">
              중요한 소식과 업데이트를 확인하세요
            </p>
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="greensupia-notice__list">
          {notices.length === 0 ? (
            <div className="greensupia-notice__empty">
              <div className="greensupia-notice__empty-icon">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="greensupia-notice__empty-title">
                등록된 공지사항이 없습니다
              </h3>
              <p className="greensupia-notice__empty-description">
                새로운 공지사항이 등록되면 여기에 표시됩니다.
              </p>
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice.id} className="greensupia-notice__card">
                <div className="greensupia-notice__card-content">
                  {/* 헤더 영역 */}
                  <div className="greensupia-notice__card-header">
                    <div className="greensupia-notice__card-title-section">
                      <div className="greensupia-notice__card-title-row">
                        {notice.isPinned && (
                          <span className="greensupia-notice__pinned-badge">
                            📌 상단고정
                          </span>
                        )}
                        <Link
                          href={`/greensupia/notice/${notice.id}`}
                          className="greensupia-notice__card-title"
                        >
                          {notice.title}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* 메타 정보 */}
                  <div className="greensupia-notice__meta">
                    <div className="greensupia-notice__meta-item">
                      <span>{notice.author}</span>
                    </div>
                    <div className="greensupia-notice__meta-item">
                      <span>{formatDate(notice.createdAt)}</span>
                    </div>
                    <div className="greensupia-notice__meta-item">
                      <span>조회 {notice.viewCount}</span>
                    </div>
                  </div>

                  {/* 첨부파일 */}
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="greensupia-notice__attachments">
                      <div className="greensupia-notice__attachments-list">
                        {notice.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={`/api/notices/attachments/${attachment.id}/download`}
                            className="greensupia-notice__attachment-link"
                            download
                          >
                            📎 {attachment.fileName}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="greensupia-notice__pagination">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={10}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>
    </div>
  );
}
