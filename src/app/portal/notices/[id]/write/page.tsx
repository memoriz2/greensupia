"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import TipTapEditor from "@/components/TipTapEditor";
import { Notice, NoticeAttachment } from "@/types/notice";

export default function WriteNoticePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 폼 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<
    NoticeAttachment[]
  >([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<number[]>([]);

  const noticeId = params.id as string;
  // 수정 모드인지 확인 (ID가 "new"가 아니고 실제 숫자 ID인 경우)
  const isEditMode = noticeId !== "new";

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode && noticeId !== "new") {
      const fetchNotice = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/notices/${noticeId}`);
          if (!response.ok) {
            throw new Error("공지사항을 불러올 수 없습니다.");
          }
          const data = await response.json();
          const notice: Notice = data.data;

          setTitle(notice.title);
          setContent(notice.content);
          setIsPinned(notice.isPinned);
          setExistingAttachments(notice.attachments || []);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "알 수 없는 오류가 발생했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchNotice();
    }
  }, [isEditMode, noticeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("isPinned", isPinned.toString());
      // 새 글 작성 시에는 항상 활성화 상태로 설정
      formData.append("isActive", "true");

      // 삭제할 첨부파일 ID들 추가
      if (isEditMode && attachmentsToDelete.length > 0) {
        formData.append(
          "attachmentsToDelete",
          JSON.stringify(attachmentsToDelete)
        );
      }

      // 새로 선택된 파일들 추가
      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      const url = isEditMode ? `/api/notices/${noticeId}` : "/api/notices";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `공지사항 ${isEditMode ? "수정" : "작성"}에 실패했습니다.`
        );
      }

      router.push("/portal/notices");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteAttachment = (attachmentId: number) => {
    setAttachmentsToDelete((prev) => [...prev, attachmentId]);
    setExistingAttachments((prev) =>
      prev.filter((att) => att.id !== attachmentId)
    );
  };

  const handleCancelDeleteAttachment = (attachmentId: number) => {
    setAttachmentsToDelete((prev) => prev.filter((id) => id !== attachmentId));
    // 기존 첨부파일 목록에서 다시 불러오기
    if (isEditMode && noticeId !== "new") {
      fetch(`/api/notices/${noticeId}`)
        .then((response) => response.json())
        .then((data) => {
          const notice: Notice = data.data;
          setExistingAttachments(notice.attachments || []);
        });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "공지사항 수정" : "새 공지사항 작성"}
        </h1>
        <Link href="/portal/notices" className="btn btn-outline">
          뒤로가기
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* 제목 입력 */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* 상단고정 체크박스 */}
          <div className="form-group">
            <label
              className="flex items-center cursor-pointer"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div style={{ position: "relative" }}>
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: isPinned ? "#f8c300" : "white",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    position: "relative",
                  }}
                />
                {isPinned && (
                  <div
                    style={{
                      position: "absolute",
                      top: "45%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "12px",
                      height: "12px",
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                상단고정
              </span>
            </label>
          </div>

          {/* 내용 에디터 */}
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              내용
            </label>
            <div className="border border-gray-300 rounded-lg">
              <TipTapEditor value={content} onChange={setContent} />
            </div>
          </div>

          {/* 파일 첨부 */}
          <div className="form-group">
            <label htmlFor="files" className="form-label">
              {isEditMode ? "첨부파일 (새로 추가할 파일만 선택)" : "첨부파일"}
            </label>
            <input
              type="file"
              id="files"
              multiple
              onChange={handleFileChange}
              className="form-input"
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">선택된 파일:</p>
                <ul className="text-sm text-gray-500">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>📎 {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 기존 첨부파일 목록 (수정 모드에서만 표시) */}
          {isEditMode && existingAttachments.length > 0 && (
            <div className="form-group">
              <label className="form-label">기존 첨부파일</label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <ul className="space-y-2">
                  {existingAttachments.map((attachment) => (
                    <li
                      key={attachment.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📎</span>
                        <span className="text-sm font-medium">
                          {attachment.fileName}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(attachment.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 삭제 예정 첨부파일 목록 */}
          {isEditMode && attachmentsToDelete.length > 0 && (
            <div className="form-group">
              <label className="form-label text-red-600">
                삭제 예정 첨부파일
              </label>
              <div className="border border-red-200 rounded-lg p-3 bg-red-50">
                <p className="text-sm text-red-600 mb-2">
                  다음 파일들이 삭제됩니다:
                </p>
                <ul className="space-y-1">
                  {attachmentsToDelete.map((attachmentId) => {
                    const attachment = existingAttachments.find(
                      (att) => att.id === attachmentId
                    );
                    return attachment ? (
                      <li
                        key={attachmentId}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-red-700">
                          🗑️ {attachment.fileName}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCancelDeleteAttachment(attachmentId)
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          취소
                        </button>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* 버튼 그룹 */}
          <div className="form-actions">
            <Link href="/portal/notices" className="cancel-btn">
              취소
            </Link>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting
                ? isEditMode
                  ? "수정 중..."
                  : "작성 중..."
                : isEditMode
                ? "수정 완료"
                : "작성 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
