"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Video } from "@/types/video";
import ToggleSwitch from "@/components/ToggleSwitch";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import {
  validateVideoUrl,
  extractThumbnailFromUrl,
  normalizeVideoUrl,
} from "@/utils/videoUtils";

interface VideoStats {
  total: number;
  active: number;
  inactive: number;
}

export default function VideoManagementPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [stats, setStats] = useState<VideoStats>({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 페이징 설정
  const itemsPerPage = 4;

  // 폼 상태
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
    sortOrder: "0",
    isActive: true,
  });

  // 폼 에러 상태
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    videoUrl?: string;
    duration?: string;
  }>({});

  // 편집 상태
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // 모달 상태
  const [modal, setModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm?: () => void;
    showCancel?: boolean;
  }>({ isOpen: false, message: "" });

  // 비디오 목록 가져오기
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/videos");
      if (!response.ok) {
        throw new Error("비디오 목록을 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      setVideos(data.content || []);

      // 통계 계산
      const total = data.content?.length || 0;
      const active = data.content?.filter((v: Video) => v.isActive).length || 0;
      const inactive = total - active;
      setStats({ total, active, inactive });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 페이지네이션 훅 사용
  const {
    currentItems: currentVideos,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    setCurrentPage,
  } = usePagination({
    items: videos,
    itemsPerPage,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  // 토글 활성화/비활성화 (1개만 활성화되도록)
  const handleToggleActive = async (video: Video) => {
    try {
      // 현재 비디오가 비활성 상태이고, 다른 활성 비디오가 있는 경우
      if (!video.isActive) {
        const activeVideos = videos.filter((v) => v.isActive);
        if (activeVideos.length > 0) {
          // 기존 활성 비디오들을 모두 비활성화
          for (const activeVideo of activeVideos) {
            await fetch(`/api/videos/${activeVideo.id}/toggle`, {
              method: "PUT",
            });
          }
        }
      }

      // 현재 비디오 토글
      const response = await fetch(`/api/videos/${video.id}/toggle`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("비디오 상태 변경에 실패했습니다.");
      }
      await fetchVideos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "상태 변경에 실패했습니다."
      );
    }
  };

  // 실시간 필드 검증
  const validateField = (name: string, value: string) => {
    const errors = { ...formErrors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          errors.title = "제목을 입력해주세요.";
        } else if (value.length > 100) {
          errors.title = "제목은 100자 이내로 입력해주세요.";
        } else {
          delete errors.title;
        }
        break;

      case "videoUrl":
        const urlValidation = validateVideoUrl(value);
        if (!urlValidation.isValid) {
          errors.videoUrl = urlValidation.error;
        } else {
          delete errors.videoUrl;
        }
        break;

      case "duration":
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
          errors.duration = "올바른 길이를 입력해주세요.";
        } else {
          delete errors.duration;
        }
        break;
    }

    setFormErrors(errors);
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // 비디오 URL인 경우 정규화
    let processedValue = value;
    if (name === "videoUrl") {
      processedValue = normalizeVideoUrl(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : processedValue,
    }));

    // 실시간 검증
    validateField(name, processedValue);

    // 비디오 URL이 변경되면 썸네일 자동 추출
    if (name === "videoUrl" && processedValue.trim()) {
      const thumbnail = extractThumbnailFromUrl(processedValue);
      if (thumbnail) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: thumbnail }));
      }
    }
  };

  // 비디오 추가
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드 검증
    validateField("title", formData.title);
    validateField("videoUrl", formData.videoUrl);
    validateField("duration", formData.duration);

    // 에러가 있으면 제출 중단
    if (Object.keys(formErrors).length > 0) {
      showModal("입력 정보를 확인해주세요.");
      return;
    }

    try {
      // 새 비디오를 활성화하려는 경우, 기존 활성 비디오들을 모두 비활성화
      if (formData.isActive) {
        const activeVideos = videos.filter((v) => v.isActive);
        for (const activeVideo of activeVideos) {
          await fetch(`/api/videos/${activeVideo.id}/toggle`, {
            method: "PUT",
          });
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("videoUrl", formData.videoUrl);
      formDataToSend.append("thumbnailUrl", formData.thumbnailUrl);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("sortOrder", formData.sortOrder);
      formDataToSend.append("isActive", formData.isActive.toString());

      const response = await fetch("/api/videos", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("비디오 추가에 실패했습니다.");
      }

      setShowAddForm(false);
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        duration: "",
        sortOrder: "0",
        isActive: true,
      });
      setFormErrors({});
      await fetchVideos();

      // 추가 후 첫 페이지로 이동
      setCurrentPage(1);

      showModal("비디오가 성공적으로 추가되었습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "비디오 추가에 실패했습니다."
      );
    }
  };

  // 비디오 편집
  const handleEditVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingVideo) {
      showModal("편집할 비디오를 선택해주세요.");
      return;
    }

    // 모든 필드 검증
    validateField("title", formData.title);
    validateField("videoUrl", formData.videoUrl);
    validateField("duration", formData.duration);

    // 에러가 있으면 제출 중단
    if (Object.keys(formErrors).length > 0) {
      showModal("입력 정보를 확인해주세요.");
      return;
    }

    try {
      // 현재 비디오를 활성화하려는 경우, 기존 활성 비디오들을 모두 비활성화
      if (formData.isActive && !editingVideo.isActive) {
        const activeVideos = videos.filter(
          (v) => v.isActive && v.id !== editingVideo.id
        );
        for (const activeVideo of activeVideos) {
          await fetch(`/api/videos/${activeVideo.id}/toggle`, {
            method: "PUT",
          });
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("videoUrl", formData.videoUrl);
      formDataToSend.append("thumbnailUrl", formData.thumbnailUrl);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("sortOrder", formData.sortOrder);
      formDataToSend.append("isActive", formData.isActive.toString());

      const response = await fetch(`/api/videos/${editingVideo.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("비디오 수정에 실패했습니다.");
      }

      setShowEditForm(false);
      setEditingVideo(null);
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        duration: "",
        sortOrder: "0",
        isActive: true,
      });
      setFormErrors({});
      await fetchVideos();

      // 수정 후 첫 페이지로 이동
      setCurrentPage(1);

      showModal("비디오가 성공적으로 수정되었습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "비디오 수정에 실패했습니다."
      );
    }
  };

  // 비디오 삭제
  const handleDeleteVideo = async (video: Video) => {
    showModal(
      `"${video.title}" 비디오를 삭제하시겠습니까?`,
      async () => {
        try {
          const response = await fetch(`/api/videos/${video.id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("비디오 삭제에 실패했습니다.");
          }
          await fetchVideos();

          // 삭제 후 페이지네이션 처리
          const newTotalPages = Math.ceil((videos.length - 1) / itemsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }

          showModal("비디오가 성공적으로 삭제되었습니다.");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "비디오 삭제에 실패했습니다."
          );
        }
      },
      true
    );
  };

  // 편집 모드 시작
  const handleEditClick = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || "",
      duration: video.duration?.toString() || "",
      sortOrder: video.sortOrder.toString(),
      isActive: video.isActive,
    });
    setFormErrors({});
    setShowEditForm(true);
  };

  // 모달 관련 함수들
  const showModal = (
    message: string,
    onConfirm?: () => void,
    showCancel: boolean = false
  ) => {
    setModal({ isOpen: true, message, onConfirm, showCancel });
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: "" });
  };

  const handleConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    closeModal();
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchVideos} />;
  }

  return (
    <div className="portal space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">비디오 관리</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + 새 비디오 추가
        </button>
      </div>

      {/* 비디오 목록 */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>설명</th>
                <th>비디오 URL</th>
                <th>썸네일</th>
                <th>길이</th>
                <th>정렬 순서</th>
                <th>활성화</th>
                <th>생성일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {currentVideos.map((video) => (
                <tr key={video.id}>
                  <td className="font-medium max-w-xs truncate">
                    {video.title}
                  </td>
                  <td className="max-w-xs truncate">
                    {video.description || "-"}
                  </td>
                  <td className="max-w-xs truncate">
                    {video.videoUrl.includes("<iframe")
                      ? "iframe 코드"
                      : video.videoUrl}
                  </td>
                  <td>
                    {video.thumbnailUrl ? (
                      <div className="flex items-center">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          width={48}
                          height={48}
                          className="object-cover rounded"
                          onError={() => {
                            // 에러 시 이미지 숨김 처리
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>{video.duration ? `${video.duration}초` : "-"}</td>
                  <td>{video.sortOrder}</td>
                  <td>
                    <ToggleSwitch
                      checked={video.isActive}
                      onChange={() => handleToggleActive(video)}
                      aria-label={video.isActive ? "활성" : "비활성"}
                    />
                  </td>
                  <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleEditClick(video)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteVideo(video)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          {videos && videos.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              maxPageNumbers={5}
            />
          )}

          {(!videos || videos.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                비디오가 없습니다
              </h3>
              <p className="text-gray-500 mb-4">
                첫 번째 비디오를 추가해보세요
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                <span>🎥</span>
                비디오 추가하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 추가 폼 모달 */}
      {showAddForm && (
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="새 비디오 추가"
          size="large"
        >
          <form onSubmit={handleAddVideo} className="modal-form">
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
                onBlur={(e) => validateField("title", e.target.value)}
                className={formErrors.title ? "error" : ""}
                required
                placeholder="비디오 제목을 입력하세요."
              />
              {formErrors.title && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {formErrors.title}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">설명</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="비디오 설명을 입력하세요."
              />
            </div>

            <div className="form-group">
              <label htmlFor="videoUrl" className="required">
                비디오 URL
              </label>
              <textarea
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                onBlur={(e) => validateField("videoUrl", e.target.value)}
                className={formErrors.videoUrl ? "error" : ""}
                required
                placeholder="https://www.youtube.com/watch?v=... 또는 YouTube iframe 코드"
                rows={3}
              />
              {formErrors.videoUrl && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {formErrors.videoUrl}
                </div>
              )}
              <div className="help-text">
                지원 형식: YouTube URL, YouTube iframe 코드, Vimeo, 직접 비디오
                파일 URL. iframe 코드는 그대로 저장됩니다.
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="thumbnailUrl">썸네일 URL</label>
              <input
                type="url"
                id="thumbnailUrl"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                placeholder="썸네일 이미지 URL (자동 추출됨)"
              />
              <div className="help-text">
                비디오 URL에서 자동으로 추출됩니다. 수동으로 변경할 수 있습니다.
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="duration">길이 (초)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                onBlur={(e) => validateField("duration", e.target.value)}
                className={formErrors.duration ? "error" : ""}
                min="0"
                placeholder="비디오 길이를 초 단위로 입력하세요."
              />
              {formErrors.duration && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {formErrors.duration}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sortOrder">정렬 순서</label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
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
                활성화된 비디오는 사용자 페이지에 표시됩니다.
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                취소
              </button>
              <button type="submit" className="submit-btn">
                등록
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 편집 폼 모달 */}
      {showEditForm && editingVideo && (
        <Modal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          title="비디오 수정"
          size="large"
        >
          <form onSubmit={handleEditVideo} className="modal-form">
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="edit-title" className="required">
                제목
              </label>
              <input
                type="text"
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={(e) => validateField("title", e.target.value)}
                className={formErrors.title ? "error" : ""}
                required
                placeholder="비디오 제목을 입력하세요."
              />
              {formErrors.title && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {formErrors.title}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-description">설명</label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="비디오 설명을 입력하세요."
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-videoUrl" className="required">
                비디오 URL
              </label>
              <textarea
                id="edit-videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                onBlur={(e) => validateField("videoUrl", e.target.value)}
                className={formErrors.videoUrl ? "error" : ""}
                required
                placeholder="https://www.youtube.com/watch?v=... 또는 YouTube iframe 코드"
                rows={3}
              />
              {formErrors.videoUrl && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {formErrors.videoUrl}
                </div>
              )}
              <div className="help-text">
                지원 형식: YouTube URL, YouTube iframe 코드, Vimeo, 직접 비디오
                파일 URL. iframe 코드는 그대로 저장됩니다.
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-thumbnailUrl">썸네일 URL</label>
              <input
                type="url"
                id="edit-thumbnailUrl"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                placeholder="썸네일 이미지 URL (자동 추출됨)"
              />
              <div className="help-text">
                비디오 URL에서 자동으로 추출됩니다. 수동으로 변경할 수 있습니다.
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-duration">길이 (초)</label>
              <input
                type="number"
                id="edit-duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                onBlur={(e) => validateField("duration", e.target.value)}
                className={formErrors.duration ? "error" : ""}
                min="0"
                placeholder="비디오 길이를 초 단위로 입력하세요."
              />
              {formErrors.duration && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {formErrors.duration}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-sortOrder">정렬 순서</label>
              <input
                type="number"
                id="edit-sortOrder"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <div className="flex items-center gap-3">
                <ToggleSwitch
                  id="edit-isActive"
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
                활성화된 비디오는 사용자 페이지에 표시됩니다.
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowEditForm(false)}
              >
                취소
              </button>
              <button type="submit" className="submit-btn">
                수정
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 통계 카드 */}
      <div className="video-stats">
        {[
          {
            number: stats.total,
            label: "전체 비디오",
          },
          {
            number: stats.active,
            label: "활성 비디오",
          },
          {
            number: stats.inactive,
            label: "비활성 비디오",
          },
        ].map((stat, index) => (
          <div key={index} className="card card-stats">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 확인 모달 */}
      <Modal isOpen={modal.isOpen} onClose={closeModal}>
        <div className="modal-form">
          <p className="text-center text-gray-700 mb-6">{modal.message}</p>
          <div className="form-actions">
            {modal.showCancel && (
              <button onClick={closeModal} className="cancel-btn">
                취소
              </button>
            )}
            <button onClick={handleConfirm} className="submit-btn">
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
