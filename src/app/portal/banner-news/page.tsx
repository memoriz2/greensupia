"use client";

import { useState, useEffect, useRef } from "react";
import { BannerNews } from "@/types/bannerNews";
import ToggleSwitch from "@/components/ToggleSwitch";
import Modal from "@/components/Modal";
import { uploadImage, validateImageFile } from "@/utils/fileUpload";

interface BannerNewsData {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  linkUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function BannerNewsPage() {
  const [bannerNews, setBannerNews] = useState<BannerNewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<BannerNewsData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    linkUrl: "",
    startDate: "",
    endDate: "",
    sortOrder: 0,
    isActive: false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBannerNews();
  }, []);

  const fetchBannerNews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/banner-news");
      if (!response.ok) {
        throw new Error("배너뉴스 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      console.log("배너뉴스 데이터 응답:", data);
      setBannerNews(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const openModal = (data: BannerNewsData | null = null) => {
    if (data) {
      setEditData(data);
      setFormData({
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || "",
        linkUrl: data.linkUrl || "",
        startDate: data.startDate ? data.startDate.split("T")[0] : "",
        endDate: data.endDate ? data.endDate.split("T")[0] : "",
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        imageUrl: "",
        linkUrl: "",
        startDate: "",
        endDate: "",
        sortOrder: 0,
        isActive: false,
      });
      setEditData(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditData(null);
    setModalOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("폼 제출 - formData:", formData);

    // 클라이언트 측 유효성 검사
    if (!formData.title || formData.title.trim().length === 0) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!formData.content || formData.content.trim().length === 0) {
      setError("내용을 입력해주세요.");
      return;
    }

    // 이미지 URL 유효성 검사 (선택사항이지만 입력된 경우 유효한 URL인지 확인)
    if (formData.imageUrl && formData.imageUrl.trim() !== "") {
      // 상대 경로인지 확인
      if (formData.imageUrl.startsWith("/")) {
        // 상대 경로는 유효한 것으로 간주
      } else {
        // 절대 URL인 경우 유효성 검사
        try {
          new URL(formData.imageUrl);
        } catch {
          setError("올바른 이미지 URL을 입력해주세요.");
          return;
        }
      }
    }

    // 에러 상태 초기화
    setError(null);

    try {
      const url = editData
        ? `/api/banner-news/${editData.id}`
        : "/api/banner-news";
      const method = editData ? "PUT" : "POST";

      // 날짜 형식 처리
      const submitData = {
        ...formData,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : null,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null,
        imageUrl: formData.imageUrl || null,
        linkUrl: formData.linkUrl || null,
      };

      console.log("요청 URL:", url);
      console.log("요청 메서드:", method);
      console.log("제출 데이터:", submitData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      console.log("응답 상태:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("에러 응답:", errorData);
        throw new Error(errorData.error || "저장에 실패했습니다.");
      }

      const result = await response.json();
      console.log("성공 응답:", result);

      await fetchBannerNews();
      closeModal();
    } catch (err) {
      console.error("폼 제출 에러:", err);
      setError(
        err instanceof Error ? err.message : "저장 중 오류가 발생했습니다."
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/banner-news/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제에 실패했습니다.");
      }

      await fetchBannerNews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다."
      );
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/banner-news/${id}/toggle`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error("상태 변경에 실패했습니다.");
      }

      await fetchBannerNews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "상태 변경 중 오류가 발생했습니다."
      );
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 검증
    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    handleImageUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);

      const result = await uploadImage(file);

      if (result.success && result.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: result.imageUrl! }));
      } else {
        setUploadError(result.error || "이미지 업로드에 실패했습니다.");
      }
    } catch (err) {
      setUploadError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadError(null);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">배너뉴스 관리</h2>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">배너뉴스 관리</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + 새 배너뉴스 추가
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>제목</th>
                <th className="content-column">내용</th>
                <th className="thumbnail-column">썸네일</th>
                <th>링크</th>
                <th>기간</th>
                <th>정렬 순서</th>
                <th>활성화</th>
                <th>생성일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {bannerNews.map((news) => (
                <tr key={news.id}>
                  <td className="font-medium max-w-xs truncate">
                    {news.title}
                  </td>
                  <td className="content-column truncate">
                    {news.content.length > 50
                      ? `${news.content.substring(0, 50)}...`
                      : news.content}
                  </td>
                  <td className="thumbnail-column">
                    {news.imageUrl ? (
                      <div className="flex items-center">
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                            const errorSpan =
                              target.nextElementSibling as HTMLElement;
                            if (errorSpan) {
                              errorSpan.classList.remove("hidden");
                            }
                          }}
                        />
                        <span className="text-red-500 text-xs ml-1 hidden">
                          이미지 로드 실패
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    {news.linkUrl ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    <div className="text-sm">
                      {news.startDate && news.endDate ? (
                        <>
                          <div>
                            {new Date(news.startDate).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">~</div>
                          <div>
                            {new Date(news.endDate).toLocaleDateString()}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td>{news.sortOrder}</td>
                  <td>
                    <ToggleSwitch
                      checked={news.isActive}
                      onChange={() =>
                        handleToggleActive(news.id, news.isActive)
                      }
                      aria-label="활성화 상태 토글"
                    />
                  </td>
                  <td>{new Date(news.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openModal(news)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(news.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bannerNews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              등록된 배너뉴스가 없습니다.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editData ? "배너뉴스 수정" : "배너뉴스 등록"}
        size="large"
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="required">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="배너뉴스 제목을 입력하세요."
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="required">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              placeholder="배너뉴스 내용을 입력하세요."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUpload">이미지 업로드</label>
            <div className="image-upload-container">
              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRef}
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* 이미지 미리보기 영역 */}
              <div className="image-preview-area">
                {formData.imageUrl ? (
                  <div className="image-preview">
                    <img
                      src={formData.imageUrl}
                      alt="미리보기"
                      className="preview-image"
                    />
                    <div className="image-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={handleImageClick}
                      >
                        변경
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={handleRemoveImage}
                      >
                        제거
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="upload-placeholder"
                    onClick={handleImageClick}
                  >
                    {uploading ? (
                      <div className="upload-loading">
                        <div className="spinner"></div>
                        <span>업로드 중...</span>
                      </div>
                    ) : (
                      <>
                        <div className="upload-icon">📷</div>
                        <span>이미지를 클릭하여 업로드</span>
                        <span className="upload-hint">
                          JPG, PNG, GIF (최대 5MB)
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 업로드 에러 메시지 */}
              {uploadError && (
                <div className="upload-error">
                  <span className="text-red-500 text-sm">{uploadError}</span>
                </div>
              )}

              {/* 이미지 URL 입력 필드 */}
              <div className="mt-3">
                <label htmlFor="imageUrl" className="text-sm text-gray-600">
                  이미지 URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="이미지를 업로드하거나 URL을 직접 입력하세요. (선택사항)"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                {formData.imageUrl && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ 이미지 URL이 설정되었습니다.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="linkUrl">링크 URL</label>
            <input
              type="text"
              id="linkUrl"
              name="linkUrl"
              value={formData.linkUrl}
              onChange={handleInputChange}
              placeholder="링크 URL을 입력하세요. (선택사항)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="startDate">시작일</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                placeholder="시작일을 선택하세요. (선택사항)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">종료일</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                placeholder="종료일을 선택하세요. (선택사항)"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sortOrder" className="required">
              정렬 순서
            </label>
            <input
              type="number"
              id="sortOrder"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleInputChange}
              required
              placeholder="정렬 순서를 입력해주세요.(예: 1)"
              min="0"
            />
          </div>

          <div className="form-group">
            <div className="flex items-center gap-3">
              <ToggleSwitch
                id="isActive"
                checked={formData.isActive}
                onChange={(checked) => {
                  setFormData((prev) => ({ ...prev, isActive: checked }));
                }}
                aria-label="활성화 상태 토글"
              />
              <span className="text-sm">
                활성화(현재: {formData.isActive ? "활성" : "비활성"})
              </span>
            </div>
            <p className="help-text">
              활성화된 배너뉴스는 사용자 페이지에 표시됩니다.
            </p>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={closeModal}>
              취소
            </button>
            <button type="submit" className="submit-btn">
              {editData ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
