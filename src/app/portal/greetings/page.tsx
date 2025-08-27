"use client";

import { useState, useEffect } from "react";
import { greeting } from "@/types/greeting";
import ToggleSwitch from "@/components/ToggleSwitch";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import TipTapEditor from "@/components/TipTapEditor";

export default function GreetingManagementPage() {
  const [greetings, setGreetings] = useState<greeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isActive: true,
  });

  // 편집 상태
  const [editingGreeting, setEditingGreeting] = useState<greeting | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // 모달 상태
  const [modal, setModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm?: () => void;
    showCancel?: boolean;
  }>({ isOpen: false, message: "" });

  // 인사말 목록 가져오기
  const fetchGreetings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/greetings");
      if (!response.ok) {
        throw new Error("인사말 목록을 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      console.log("Greetings API response:", data);
      setGreetings(data.content || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGreetings();
  }, []);

  // 토글 활성화/비활성화 (활성화는 1개만 가능)
  const handleToggleActive = async (greetingItem: greeting) => {
    try {
      // 활성화하려는 경우, 다른 활성화된 인사말이 있는지 확인
      if (!greetingItem.isActive) {
        const activeGreetings = greetings.filter((g) => g.isActive);
        if (activeGreetings.length > 0) {
          showModal(
            "활성화된 인사말이 이미 존재합니다. 다른 인사말을 비활성화한 후 다시 시도해주세요.",
            undefined,
            false
          );
          return;
        }
      }

      const response = await fetch(`/api/greetings/${greetingItem.id}/toggle`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("인사말 상태 변경에 실패했습니다.");
      }
      await fetchGreetings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "상태 변경에 실패했습니다."
      );
    }
  };

  // 인사말 추가
  const handleAddGreeting = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      showModal("제목과 내용을 입력해주세요.");
      return;
    }

    // 활성화하려는 경우, 다른 활성화된 인사말이 있는지 확인
    if (formData.isActive) {
      const activeGreetings = greetings.filter((g) => g.isActive);
      if (activeGreetings.length > 0) {
        showModal(
          "활성화된 인사말이 이미 존재합니다. 다른 인사말을 비활성화한 후 다시 시도해주세요.",
          undefined,
          false
        );
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("isActive", formData.isActive.toString());

      const response = await fetch("/api/greetings", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("인사말 추가에 실패했습니다.");
      }

      setShowAddForm(false);
      setFormData({
        title: "",
        content: "",
        isActive: true,
      });
      await fetchGreetings();
      showModal("인사말이 성공적으로 추가되었습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "인사말 추가에 실패했습니다."
      );
    }
  };

  // 인사말 편집
  const handleEditGreeting = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !editingGreeting ||
      !formData.title.trim() ||
      !formData.content.trim()
    ) {
      showModal("제목과 내용을 입력해주세요.");
      return;
    }

    // 활성화하려는 경우, 다른 활성화된 인사말이 있는지 확인 (현재 편집 중인 인사말 제외)
    if (formData.isActive) {
      const otherActiveGreetings = greetings.filter(
        (g) => g.isActive && g.id !== editingGreeting.id
      );
      if (otherActiveGreetings.length > 0) {
        showModal(
          "활성화된 인사말이 이미 존재합니다. 다른 인사말을 비활성화한 후 다시 시도해주세요.",
          undefined,
          false
        );
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("isActive", formData.isActive.toString());

      const response = await fetch(`/api/greetings/${editingGreeting.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("인사말 수정에 실패했습니다.");
      }

      setShowEditForm(false);
      setEditingGreeting(null);
      setFormData({
        title: "",
        content: "",
        isActive: true,
      });
      await fetchGreetings();
      showModal("인사말이 성공적으로 수정되었습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "인사말 수정에 실패했습니다."
      );
    }
  };

  // 인사말 삭제
  const handleDeleteGreeting = async (greetingItem: greeting) => {
    showModal(
      `"${greetingItem.title}" 인사말을 삭제하시겠습니까?`,
      async () => {
        try {
          const response = await fetch(`/api/greetings/${greetingItem.id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("인사말 삭제에 실패했습니다.");
          }
          await fetchGreetings();
          showModal("인사말이 성공적으로 삭제되었습니다.");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "인사말 삭제에 실패했습니다."
          );
        }
      },
      true
    );
  };

  // 편집 모드 시작
  const handleEditClick = (greetingItem: greeting) => {
    setEditingGreeting(greetingItem);
    setFormData({
      title: greetingItem.title,
      content: greetingItem.content,
      isActive: greetingItem.isActive,
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

  // 입력 필드 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchGreetings} />;
  }

  return (
    <div className="greeting-management">
      <div className="page-header">
        <h1>인사말 관리</h1>
        <button className="add-button" onClick={() => setShowAddForm(true)}>
          + 새 인사말 추가
        </button>
      </div>

      {/* 인사말 목록 */}
      <div className="greeting-list">
        {greetings.length === 0 ? (
          <div className="empty-state">
            <p>등록된 인사말이 없습니다.</p>
            <button className="add-button" onClick={() => setShowAddForm(true)}>
              첫 번째 인사말 추가하기
            </button>
          </div>
        ) : (
          greetings.map((greeting) => (
            <div key={greeting.id} className="greeting-item">
              <div className="greeting-info">
                <h3>{greeting.title}</h3>
                <div className="greeting-content">
                  <div
                    dangerouslySetInnerHTML={{ __html: greeting.content }}
                    className="content-preview"
                  />
                </div>
                <div className="greeting-dates">
                  <span>
                    생성: {new Date(greeting.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    수정: {new Date(greeting.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="greeting-actions">
                <ToggleSwitch
                  checked={greeting.isActive}
                  onChange={() => handleToggleActive(greeting)}
                  aria-label={greeting.isActive ? "활성" : "비활성"}
                />
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(greeting)}
                >
                  수정
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteGreeting(greeting)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 통계 섹션 */}
      <div className="greeting-stats">
        <div className="card card-stats">
          <div className="stat-number">{greetings.length}</div>
          <div className="stat-label">전체 인사말</div>
        </div>
        <div className="card card-stats">
          <div className="stat-number">
            {greetings.filter((g) => g.isActive).length}
          </div>
          <div className="stat-label">활성 인사말</div>
        </div>
        <div className="card card-stats">
          <div className="stat-number">
            {greetings.filter((g) => !g.isActive).length}
          </div>
          <div className="stat-label">비활성 인사말</div>
        </div>
      </div>

      {/* 추가 폼 모달 */}
      {showAddForm && (
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="새 인사말 추가"
          size="large"
        >
          <form onSubmit={handleAddGreeting} className="modal-form">
            <div className="form-group">
              <label htmlFor="title">제목 *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">내용 *</label>
              <TipTapEditor
                value={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
                placeholder="인사말 내용을 입력하세요..."
                height={300}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                활성화
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                추가
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                취소
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 편집 폼 모달 */}
      {showEditForm && editingGreeting && (
        <Modal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          title="인사말 수정"
          size="large"
        >
          <form onSubmit={handleEditGreeting} className="modal-form">
            <div className="form-group">
              <label htmlFor="edit-title">제목 *</label>
              <input
                type="text"
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-content">내용 *</label>
              <TipTapEditor
                value={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
                placeholder="인사말 내용을 입력하세요..."
                height={300}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                활성화
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                수정
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowEditForm(false)}
              >
                취소
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 확인 모달 */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title="알림"
        size="small"
      >
        <div className="modal-confirm">
          <p>{modal.message}</p>
          <div className="modal-actions">
            <button onClick={handleConfirm} className="submit-btn">
              확인
            </button>
            {modal.showCancel && (
              <button onClick={closeModal} className="cancel-btn">
                취소
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
