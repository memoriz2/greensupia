"use client";

import { useState, useEffect } from "react";
import { Greeting } from "@/types/greeting";
import ToggleSwitch from "@/components/ToggleSwitch";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function GreetingManagementPage() {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
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
  const [editingGreeting, setEditingGreeting] = useState<Greeting | null>(null);
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

  // 토글 활성화/비활성화
  const handleToggleActive = async (greeting: Greeting) => {
    try {
      const response = await fetch(`/api/greetings/${greeting.id}/toggle`, {
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
  const handleDeleteGreeting = async (greeting: Greeting) => {
    showModal(
      `"${greeting.title}" 인사말을 삭제하시겠습니까?`,
      async () => {
        try {
          const response = await fetch(`/api/greetings/${greeting.id}`, {
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
  const handleEditClick = (greeting: Greeting) => {
    setEditingGreeting(greeting);
    setFormData({
      title: greeting.title,
      content: greeting.content,
      isActive: greeting.isActive,
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

      {/* 추가 폼 모달 */}
      {showAddForm && (
        <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
          <div className="modal-content">
            <h2>새 인사말 추가</h2>
            <form onSubmit={handleAddGreeting}>
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
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                  required
                  placeholder="HTML 태그를 사용할 수 있습니다. 예: <p>안녕하세요!</p>"
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
                <button type="submit" className="submit-button">
                  추가
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowAddForm(false)}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* 편집 폼 모달 */}
      {showEditForm && editingGreeting && (
        <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
          <div className="modal-content">
            <h2>인사말 수정</h2>
            <form onSubmit={handleEditGreeting}>
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
                <textarea
                  id="edit-content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                  required
                  placeholder="HTML 태그를 사용할 수 있습니다. 예: <p>안녕하세요!</p>"
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
                <button type="submit" className="submit-button">
                  수정
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowEditForm(false)}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* 확인 모달 */}
      <Modal isOpen={modal.isOpen} onClose={closeModal}>
        <div className="modal-content">
          <p>{modal.message}</p>
          <div className="modal-actions">
            <button onClick={handleConfirm} className="confirm-button">
              확인
            </button>
            {modal.showCancel && (
              <button onClick={closeModal} className="cancel-button">
                취소
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
