"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { OrganizationChart } from "@/types/organization";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";

export default function OrganizationPage() {
  const [organizationCharts, setOrganizationCharts] = useState<
    OrganizationChart[] | null
  >(null);
  const [activeChart, setActiveChart] = useState<OrganizationChart | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 페이징 설정
  const itemsPerPage = 4;

  useEffect(() => {
    fetchOrganizationCharts();
  }, []);

  const fetchOrganizationCharts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/organization");
      if (!response.ok) {
        throw new Error("조직도 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();

      setOrganizationCharts(data || []);

      // 활성 조직도 찾기
      const active = data?.find((chart: OrganizationChart) => chart.isActive);
      setActiveChart(active || null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setOrganizationCharts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);

      // 새 조직도를 활성화하려는 경우, 기존 활성 조직도들을 모두 비활성화
      const activeCharts =
        organizationCharts?.filter((chart) => chart.isActive) || [];
      for (const activeChart of activeCharts) {
        await fetch(`/api/organization/${activeChart.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: false,
          }),
        });
      }

      const formData = new FormData();
      formData.append("imageFile", file);
      formData.append("isActive", "true");

      const response = await fetch("/api/organization", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "업로드에 실패했습니다.");
      }

      await fetchOrganizationCharts();

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

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      // 비활성 상태에서 활성화하려는 경우, 기존 활성 조직도들을 모두 비활성화
      if (!currentActive) {
        const activeCharts =
          organizationCharts?.filter((chart) => chart.isActive) || [];
        for (const activeChart of activeCharts) {
          await fetch(`/api/organization/${activeChart.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isActive: false,
            }),
          });
        }
      }

      // 현재 조직도 토글
      const response = await fetch(`/api/organization/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentActive,
        }),
      });

      if (!response.ok) {
        throw new Error("상태 변경에 실패했습니다.");
      }

      await fetchOrganizationCharts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "상태 변경 중 오류가 발생했습니다."
      );
    }
  };

  // 페이징 훅 사용
  const {
    currentItems: currentCharts,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    goToPage,
  } = usePagination({
    items: organizationCharts || [],
    itemsPerPage,
  });

  const handleDelete = async (id: number) => {
    if (!confirm("정말로 이 조직도를 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/organization/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제에 실패했습니다.");
      }

      await fetchOrganizationCharts();

      // 현재 페이지의 마지막 아이템을 삭제했고, 이전 페이지가 있다면 이전 페이지로 이동
      const newTotalPages = Math.ceil(
        ((organizationCharts?.length || 0) - 1) / itemsPerPage
      );
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다."
      );
    }
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-medium">
          📊 조직도 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">조직도 관리</h2>
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="portal space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">조직도 관리</h1>
          <p className="text-gray-600">회사 조직도를 이미지로 관리하세요</p>
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span>⏳</span>
                업로드 중...
              </>
            ) : (
              <>
                <span>📤</span>새 조직도 업로드
              </>
            )}
          </button>
        </div>
      </div>

      {/* 파일 업로드 입력 (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 업로드 에러 메시지 */}
      {uploadError && (
        <div className="card">
          <div className="text-red-600 bg-red-50 p-4 rounded-lg">
            {uploadError}
          </div>
        </div>
      )}

      {/* 조직도 목록과 활성 조직도 - 2열 가로 배치 */}
      <div className="organization-layout">
        {/* 왼쪽: 조직도 목록 */}
        <div className="organization-list-section">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">조직도 목록</h2>
              <div className="text-sm text-gray-500">
                총 {organizationCharts?.length || 0}개
              </div>
            </div>

            <div className="space-y-4">
              {currentCharts.map((chart) => (
                <div key={chart.id} className="organization-list__item">
                  <div className="organization-list__content">
                    <div className="organization-list__info">
                      <div className="organization-thumbnail">
                        <Image
                          src={chart.imageUrl}
                          alt="조직도 미리보기"
                          width={80}
                          height={60}
                          className="organization-thumbnail__image"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                      <div className="organization-list__details">
                        <div className="title">조직도 #{chart.id}</div>
                        <div className="date">
                          업로드:{" "}
                          {new Date(chart.createdAt).toLocaleDateString(
                            "ko-KR"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="organization-list__actions">
                      <span
                        className={`status-badge ${
                          chart.isActive ? "active" : "inactive"
                        }`}
                      >
                        {chart.isActive ? "활성" : "비활성"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline text-xs"
                          onClick={() =>
                            handleToggleActive(chart.id, chart.isActive)
                          }
                          disabled={chart.isActive}
                        >
                          <span>🔄</span>
                          {chart.isActive ? "활성" : "활성화"}
                        </button>
                        <button
                          className="btn btn-danger text-xs"
                          onClick={() => handleDelete(chart.id)}
                          disabled={chart.isActive}
                        >
                          <span>🗑️</span>
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {organizationCharts && organizationCharts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                maxPageNumbers={5}
              />
            )}

            {(!organizationCharts || organizationCharts.length === 0) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  조직도가 없습니다
                </h3>
                <p className="text-gray-500 mb-4">
                  첫 번째 조직도를 업로드해보세요
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span>📤</span>
                  조직도 업로드하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 활성 조직도 미리보기 */}
        {activeChart && (
          <div className="organization-preview-section-wrapper">
            <div className="card organization-preview-section">
              <div className="organization-preview-section__header">
                <h2 className="organization-preview-section__title">
                  현재 활성 조직도
                </h2>
                <span className="status-badge active">활성</span>
              </div>
              <div className="organization-preview-section__content">
                <div className="organization-preview__container">
                  <div className="organization-preview__image-wrapper">
                    <Image
                      src={activeChart.imageUrl}
                      alt="조직도"
                      width={400}
                      height={300}
                      className="organization-preview__image"
                      priority={false}
                      unoptimized={true}
                    />
                  </div>
                  <div className="organization-preview-section__date">
                    업로드:{" "}
                    {new Date(activeChart.createdAt).toLocaleDateString(
                      "ko-KR"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 통계 카드 */}
      <div className="organization-stats">
        {[
          {
            number: organizationCharts?.length || 0,
            label: "전체 조직도",
          },
          {
            number:
              organizationCharts?.filter((chart) => chart.isActive).length || 0,
            label: "활성 조직도",
          },
          {
            number:
              organizationCharts?.filter((chart) => !chart.isActive).length ||
              0,
            label: "비활성 조직도",
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
