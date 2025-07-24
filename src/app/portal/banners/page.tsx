"use client";

import { useState, useEffect, useRef } from "react";
import { Banner } from "@/types/banner";
import ToggleSwitch from "@/components/ToggleSwitch";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    inactive: number;
  }>({ total: 0, active: 0, inactive: 0 });

  // 페이징 설정
  const itemsPerPage = 4;

  // 폼 상태
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    sortOrder: "0",
    isActive: true,
  });

  // 파일 업로드 상태
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 편집 상태
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // 편집용 파일 업로드 상태
  const [editUploading, setEditUploading] = useState(false);
  const [editUploadError, setEditUploadError] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // 모달 상태
  const [modal, setModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm?: () => void;
    showCancel?: boolean;
  }>({ isOpen: false, message: "" });

  // 배너 목록 가져오기
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/banners");
      if (!response.ok) {
        throw new Error("배너 목록을 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      setBanners(data.content || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 통계 정보 가져오기
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/banners?action=stats");
      if (!response.ok) {
        throw new Error("통계 정보를 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("통계 정보 가져오기 실패:", err);
    }
  };

  // 페이지네이션 훅 사용
  const {
    currentItems: currentBanners,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    setCurrentPage,
  } = usePagination({
    items: banners,
    itemsPerPage,
  });

  useEffect(() => {
    fetchBanners();
    fetchStats();
  }, []);

  // 파일 업로드 핸들러
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "업로드에 실패했습니다.");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다."
      );
    } finally {
      setUploading(false);
    }
  };

  // 편집용 파일 업로드 핸들러
  const handleEditFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setEditUploading(true);
      setEditUploadError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "업로드에 실패했습니다.");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));

      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
    } catch (err) {
      setEditUploadError(
        err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다."
      );
    } finally {
      setEditUploading(false);
    }
  };

  // 토글 활성화/비활성화
  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/banners/${banner.id}/toggle`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("배너 상태 변경에 실패했습니다.");
      }
      await fetchBanners();
      await fetchStats();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "상태 변경에 실패했습니다."
      );
    }
  };

  // 배너 추가
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      showModal("제목과 이미지를 입력해주세요.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("imageUrl", formData.imageUrl);
      formDataToSend.append("sortOrder", formData.sortOrder);
      formDataToSend.append("isActive", formData.isActive.toString());

      const response = await fetch("/api/banners", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("배너 추가에 실패했습니다.");
      }

      setShowAddForm(false);
      setFormData({
        title: "",
        imageUrl: "",
        sortOrder: "0",
        isActive: true,
      });
      await fetchBanners();
      await fetchStats();
      setCurrentPage(1); // 첫 페이지로 리셋
      showModal("배너가 성공적으로 추가되었습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "배너 추가에 실패했습니다."
      );
    }
  };

  // 배너 편집
  const handleEditBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBanner || !formData.title.trim() || !formData.imageUrl.trim()) {
      showModal("제목과 이미지를 입력해주세요.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("imageUrl", formData.imageUrl);
      formDataToSend.append("sortOrder", formData.sortOrder);
      formDataToSend.append("isActive", formData.isActive.toString());

      const response = await fetch(`/api/banners/${editingBanner.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("배너 수정에 실패했습니다.");
      }

      setShowEditForm(false);
      setEditingBanner(null);
      setFormData({
        title: "",
        imageUrl: "",
        sortOrder: "0",
        isActive: true,
      });
      await fetchBanners();
      await fetchStats();
      setCurrentPage(1); // 첫 페이지로 리셋
      showModal("배너가 성공적으로 수정되었습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "배너 수정에 실패했습니다."
      );
    }
  };

  // 배너 삭제
  const handleDeleteBanner = async (banner: Banner) => {
    showModal(
      `"${banner.title}" 배너를 삭제하시겠습니까?`,
      async () => {
        try {
          const response = await fetch(`/api/banners/${banner.id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("배너 삭제에 실패했습니다.");
          }
          await fetchBanners();
          await fetchStats();
          setCurrentPage(1); // 첫 페이지로 리셋
          showModal("배너가 성공적으로 삭제되었습니다.");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "배너 삭제에 실패했습니다."
          );
        }
      },
      true
    );
  };

  // 편집 모드 시작
  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl || "",
      sortOrder: banner.sortOrder.toString(),
      isActive: banner.isActive,
    });
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

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value || "",
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchBanners} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">배너 관리</h1>
          <p className="text-gray-600">웹사이트 배너를 관리하세요</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + 새 배너 추가
        </button>
      </div>

      {/* 배너 목록 */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>이미지</th>
                <th>정렬 순서</th>
                <th>활성화</th>
                <th>생성일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {currentBanners.map((banner) => (
                <tr key={banner.id}>
                  <td className="font-medium max-w-xs truncate">
                    {banner.title}
                  </td>
                  <td>
                    {banner.imageUrl ? (
                      <div className="flex items-center">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-16 h-12 object-cover rounded"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>{banner.sortOrder}</td>
                  <td>
                    <ToggleSwitch
                      checked={banner.isActive}
                      onChange={() => handleToggleActive(banner)}
                      aria-label={banner.isActive ? "활성" : "비활성"}
                    />
                  </td>
                  <td>{new Date(banner.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleEditClick(banner)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteBanner(banner)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentBanners.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                배너가 없습니다
              </h3>
              <p className="text-gray-500 mb-4">첫 번째 배너를 추가해보세요</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                <span>🖼️</span>
                배너 추가하기
              </button>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* 추가 폼 모달 */}
      {showAddForm && (
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="새 배너 추가"
          size="large"
        >
          <form onSubmit={handleAddBanner} className="modal-form">
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
                value={formData.title || ""}
                onChange={handleInputChange}
                required
                placeholder="배너 제목을 입력하세요."
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl" className="required">
                이미지
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={handleInputChange}
                  required
                  placeholder="이미지 URL을 입력하거나 파일을 업로드하세요."
                  className="flex-1"
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "업로드 중..." : "파일 선택"}
                </button>
              </div>
              {uploadError && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {uploadError}
                </div>
              )}
              {formData.imageUrl && (
                <div className="mt-2 w-1/2 h-20 bg-gray-100 rounded border flex items-center justify-center overflow-hidden mx-auto">
                  <img
                    src={formData.imageUrl}
                    alt="미리보기"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sortOrder">정렬 순서</label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                value={formData.sortOrder || "0"}
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
                활성화된 배너는 사용자 페이지에 표시됩니다.
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

          {/* 파일 업로드 입력 (숨김) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Modal>
      )}

      {/* 편집 폼 모달 */}
      {showEditForm && editingBanner && (
        <Modal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          title="배너 수정"
          size="large"
        >
          <form onSubmit={handleEditBanner} className="modal-form">
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
                value={formData.title || ""}
                onChange={handleInputChange}
                required
                placeholder="배너 제목을 입력하세요."
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-imageUrl" className="required">
                이미지
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="edit-imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={handleInputChange}
                  required
                  placeholder="이미지 URL을 입력하거나 파일을 업로드하세요."
                  className="flex-1"
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => editFileInputRef.current?.click()}
                  disabled={editUploading}
                >
                  {editUploading ? "업로드 중..." : "파일 선택"}
                </button>
              </div>
              {editUploadError && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {editUploadError}
                </div>
              )}
              {formData.imageUrl && (
                <div className="mt-2 w-1/2 h-20 bg-gray-100 rounded border flex items-center justify-center overflow-hidden mx-auto">
                  <img
                    src={formData.imageUrl}
                    alt="미리보기"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-sortOrder">정렬 순서</label>
              <input
                type="number"
                id="edit-sortOrder"
                name="sortOrder"
                value={formData.sortOrder || "0"}
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
                활성화된 배너는 사용자 페이지에 표시됩니다.
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

          {/* 편집용 파일 업로드 입력 (숨김) */}
          <input
            ref={editFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleEditFileUpload}
            className="hidden"
          />
        </Modal>
      )}

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

      {/* 통계 카드 */}
      <div className="banner-stats">
        {[
          {
            number: stats.total,
            label: "전체 배너",
          },
          {
            number: stats.active,
            label: "활성 배너",
          },
          {
            number: stats.inactive,
            label: "비활성 배너",
          },
        ].map((stat, index) => (
          <div key={index} className="card card-stats">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
