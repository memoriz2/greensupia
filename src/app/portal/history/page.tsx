"use client";

import { useState, useEffect } from "react";
import { History } from "@/types/history";
import ToggleSwitch from "@/components/ToggleSwitch";
import Modal from "@/components/Modal";

interface HistoryData {
  id: number;
  year: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function HistoryPage() {
  const [histories, setHistories] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<HistoryData | null>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    description: "",
    sortOrder: 0,
    isActive: false,
  });

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/history");
      if (!response.ok) {
        throw new Error("히스토리 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      console.log("히스토리 데이터 응답:", data);
      setHistories(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const openModal = (data: HistoryData | null = null) => {
    if (data) {
      setEditData(data);
      setFormData({
        year: data.year,
        description: data.description,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    } else {
      setFormData({
        year: new Date().getFullYear().toString(),
        description: "",
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
    if (!formData.year || formData.year.trim().length === 0) {
      setError("연도를 입력해주세요.");
      return;
    }

    if (!formData.description || formData.description.trim().length === 0) {
      setError("설명을 입력해주세요.");
      return;
    }

    // 연도 형식 검사
    const yearPattern = /^(19|20)\d{2}$/;
    if (!yearPattern.test(formData.year)) {
      setError("올바른 연도를 입력해주세요. (1900-2099)");
      return;
    }

    // 에러 상태 초기화
    setError(null);

    try {
      const url = editData ? `/api/history/${editData.id}` : "/api/history";
      const method = editData ? "PUT" : "POST";

      console.log("요청 URL:", url);
      console.log("요청 메서드:", method);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("응답 상태:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("에러 응답:", errorData);
        throw new Error(errorData.error || "저장에 실패했습니다.");
      }

      const result = await response.json();
      console.log("성공 응답:", result);

      await fetchHistories();
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

    if (name === "year") {
      // 연도는 문자열로 저장
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제에 실패했습니다.");
      }

      await fetchHistories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다."
      );
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/history/${id}/toggle`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error("상태 변경에 실패했습니다.");
      }

      await fetchHistories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "상태 변경 중 오류가 발생했습니다."
      );
    }
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
        <h2 className="text-xl font-semibold mb-4">히스토리 관리</h2>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">연혁 관리</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + 새 연혁 추가
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>연도</th>
                <th>설명</th>
                <th>정렬 순서</th>
                <th>활성화</th>
                <th>생성일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((history) => (
                <tr key={history.id}>
                  <td className="font-medium">{history.year}</td>
                  <td className="max-w-md truncate">
                    {history.description.length > 50
                      ? `${history.description.substring(0, 50)}...`
                      : history.description}
                  </td>
                  <td>{history.sortOrder}</td>
                  <td>
                    <ToggleSwitch
                      checked={history.isActive}
                      onChange={() =>
                        handleToggleActive(history.id, history.isActive)
                      }
                      aria-label="활성화 상태 토글"
                    />
                  </td>
                  <td>{new Date(history.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openModal(history)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(history.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {histories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              등록된 연혁이 없습니다.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editData ? "연혁 수정" : "연혁 등록"}
        size="medium"
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="year" className="required">
              연도
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
              className="form-select"
            >
              <option value="">연도를 선택해주세요 (기본값: 올해)</option>
              {Array.from({ length: 200 }, (_, i) => 1900 + i).map((year) => (
                <option key={year} value={year.toString()}>
                  {year}년
                </option>
              ))}
            </select>
            <p className="help-text">
              드롭다운에서 원하는 연도를 선택해주세요.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="required">
              설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="연혁에 대한 설명을 입력하세요."
              rows={4}
            />
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
              활성화된 연혁은 사용자 페이지에 표시됩니다.
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
