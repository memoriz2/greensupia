"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notice } from "@/types/notice";
import Pagination from "@/components/Pagination";

export default function NoticesPage() {
  const [notices, setNotices] = useState<notice[]>([]);
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

  const handleTogglePin = async (id: number) => {
    try {
      const response = await fetch(`/api/notices/${id}/toggle`, {
        method: "PATCH",
      });

      if (response.ok) {
        // 목록 새로고침
        fetchNotices(page);
      }
    } catch (err) {
      console.error("상단고정 토글 오류:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 목록 새로고침
        fetchNotices(page);
      }
    } catch (err) {
      console.error("공지사항 삭제 오류:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">공지사항 관리</h2>
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="portal__container">
      <div className="portal__header">
        <div className="flex justify-between items-center">
          <h1 className="portal__title">공지사항 관리</h1>
          <Link href="/portal/notices/new/write" className="portal__button">
            새 공지사항 작성
          </Link>
        </div>
      </div>

      <div className="portal__card">
        <div className="overflow-x-auto">
          <table className="portal__table">
            <thead>
              <tr>
                <th>상태</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>첨부파일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                notices.map((notice) => (
                  <tr key={notice.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        {notice.isPinned && (
                          <span className="status-badge active">📌 고정</span>
                        )}
                        {!notice.isActive && (
                          <span className="status-badge inactive">비활성</span>
                        )}
                      </div>
                    </td>
                    <td className="max-w-xs truncate font-medium">
                      {notice.title}
                    </td>
                    <td>{notice.author}</td>
                    <td>{formatDate(notice.createdAt)}</td>
                    <td>{notice.viewCount}</td>
                    <td className="max-w-md">
                      {notice.attachments && notice.attachments.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {notice.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="text-xs text-gray-600"
                            >
                              📎 {attachment.fileName} (
                              {formatFileSize(attachment.fileSize)})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">없음</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/portal/notices/${notice.id}/write?edit=true`}
                          className="portal__button"
                          style={{
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                          }}
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => handleTogglePin(notice.id)}
                          className="portal__button"
                          style={{
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                            background: notice.isPinned
                              ? "#ed8936"
                              : "linear-gradient(135deg, #f8c300 0%, #ffd886 100%)",
                          }}
                        >
                          {notice.isPinned ? "고정해제" : "고정"}
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="portal__button"
                          style={{
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                            background: "#f56565",
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
