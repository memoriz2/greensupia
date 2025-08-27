"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { notice } from "@/types/notice";

export default function NoticeDetailPage() {
  const params = useParams();
  const [notice, setNotice] = useState<notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/notices/${params.id}`);
        const result = await response.json();

        if (result.success) {
          setNotice(result.data);
        }
      } catch (error) {
        console.error("공지사항 불러오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNotice();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
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
      <div className="greensupia-notice">
        <Header />
        <main className="greensupia-notice__container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">공지사항을 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="greensupia-notice">
        <Header />
        <main className="greensupia-notice__container">
          <div className="text-center">
            <div className="greensupia-notice__empty">
              <p className="text-red-800 text-lg mb-4">
                공지사항을 찾을 수 없습니다.
              </p>
              <Link
                href="/greensupia/notice"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="greensupia-notice">
      <Header />

      <main className="greensupia-notice__container">
        {/* 뒤로가기 버튼 */}
        <div className="greensupia-notice__back-button">
          <Link
            href="/greensupia/notice"
            className="greensupia-notice__back-link"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        {/* 공지사항 상세 */}
        <div className="greensupia-notice__detail-card">
          {/* 헤더 */}
          <div className="greensupia-notice__detail-header">
            <div className="greensupia-notice__detail-title-section">
              <div className="greensupia-notice__detail-title-row">
                {notice.isPinned && (
                  <span className="greensupia-notice__pinned-badge">
                    📌 상단고정
                  </span>
                )}
              </div>
              <h1 className="greensupia-notice__detail-title">
                {notice.title}
              </h1>
              <div className="greensupia-notice__detail-meta">
                <span>작성자: {notice.author}</span>
                <span>작성일: {formatDate(notice.createdAt)}</span>
                <span>조회수: {notice.viewCount}</span>
              </div>
            </div>
          </div>

          {/* 내용 */}
          <div className="greensupia-notice__detail-content">
            <div
              className="greensupia-notice__content-html"
              dangerouslySetInnerHTML={{ __html: notice.content }}
            />
          </div>

          {/* 첨부파일 */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="greensupia-notice__detail-attachments">
              <h3 className="greensupia-notice__attachments-title">첨부파일</h3>
              <div className="greensupia-notice__attachments-list">
                {notice.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="greensupia-notice__attachment-item"
                  >
                    <div className="greensupia-notice__attachment-info">
                      <span className="greensupia-notice__attachment-icon">
                        📎
                      </span>
                      <div className="greensupia-notice__attachment-details">
                        <div className="greensupia-notice__attachment-name">
                          {attachment.fileName}
                        </div>
                        <div className="greensupia-notice__attachment-meta">
                          {formatFileSize(attachment.fileSize)} | 다운로드:{" "}
                          {attachment.downloadCount}회
                        </div>
                      </div>
                    </div>
                    <a
                      href={`/api/notices/attachments/${attachment.id}/download`}
                      className="greensupia-notice__download-button"
                      download
                    >
                      다운로드
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="greensupia-notice__bottom-button">
          <Link
            href="/greensupia/notice"
            className="greensupia-notice__back-button-large"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
