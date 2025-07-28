"use client";

import { useState, useEffect } from "react";

interface DashboardStats {
  todos: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
  organization: {
    total: number;
    departments: string[];
  };
  history: {
    total: number;
    yearRange: { min: number; max: number };
  };
  bannerNews: {
    total: number;
    active: number;
    inactive: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 각 API에서 기본 데이터 가져오기
        const [todoData, orgData, historyData, bannerData] = await Promise.all([
          fetch("/api/todos").then((res) => res.json()),
          fetch("/api/organization").then((res) => res.json()),
          fetch("/api/history").then((res) => res.json()),
          fetch("/api/banner-news").then((res) => res.json()),
        ]);

        // 데이터를 기반으로 통계 계산
        const todos = Array.isArray(todoData) ? todoData : [];
        const organization = Array.isArray(orgData) ? orgData : [];
        const history = Array.isArray(historyData) ? historyData : [];
        const bannerNews = Array.isArray(bannerData) ? bannerData : [];

        setStats({
          todos: {
            total: todos.length,
            completed: todos.filter(
              (todo: { completed: boolean }) => todo.completed
            ).length,
            pending: todos.filter(
              (todo: { completed: boolean }) => !todo.completed
            ).length,
            completionRate:
              todos.length > 0
                ? Math.round(
                    (todos.filter(
                      (todo: { completed: boolean }) => todo.completed
                    ).length /
                      todos.length) *
                      100
                  )
                : 0,
          },
          organization: {
            total: organization.length,
            departments: [
              ...new Set(
                organization.map(
                  (org: { department: string }) => org.department
                )
              ),
            ],
          },
          history: {
            total: history.length,
            yearRange:
              history.length > 0
                ? {
                    min: Math.min(
                      ...history.map((h: { year: number }) => h.year)
                    ),
                    max: Math.max(
                      ...history.map((h: { year: number }) => h.year)
                    ),
                  }
                : { min: 2024, max: 2024 },
          },
          bannerNews: {
            total: bannerNews.length,
            active: bannerNews.filter(
              (news: { isActive: boolean }) => news.isActive
            ).length,
            inactive: bannerNews.filter(
              (news: { isActive: boolean }) => !news.isActive
            ).length,
          },
        });
      } catch (error) {
        console.error("대시보드 데이터 로딩 실패:", error);
        // 에러가 발생해도 기본값으로 설정
        setStats({
          todos: { total: 0, completed: 0, pending: 0, completionRate: 0 },
          organization: { total: 0, departments: [] },
          history: { total: 0, yearRange: { min: 2024, max: 2024 } },
          bannerNews: { total: 0, active: 0, inactive: 0 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section
        className="flex items-center justify-center h-64"
        aria-label="로딩 중"
      >
        <div className="text-lg font-medium" role="status" aria-live="polite">
          📊 대시보드 데이터를 불러오는 중...
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section
        className="text-center text-red-600"
        role="alert"
        aria-live="assertive"
      >
        <p>데이터를 불러올 수 없습니다.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600">시스템 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드들 */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        aria-label="시스템 통계"
      >
        {/* Todo 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.todos.total}</div>
          <div className="stat-label">전체 할일</div>
          <div className="mt-2 text-sm text-gray-500">
            완료: {stats.todos.completed} | 진행중: {stats.todos.pending}
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.todos.completionRate}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              완료율: {stats.todos.completionRate}%
            </div>
          </div>
        </div>

        {/* 조직도 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.organization.total}</div>
          <div className="stat-label">조직 구성원</div>
          <div className="mt-2 text-sm text-gray-500">
            부서: {stats.organization.departments?.length || 0}개
          </div>
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {stats.organization.departments
                ?.slice(0, 3)
                .map((dept, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {dept}
                  </span>
                ))}
              {(stats.organization.departments?.length || 0) > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{(stats.organization.departments?.length || 0) - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 히스토리 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.history.total}</div>
          <div className="stat-label">회사 히스토리</div>
          <div className="mt-2 text-sm text-gray-500">
            {stats.history.yearRange.min} - {stats.history.yearRange.max}
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-500">
              총 {stats.history.yearRange.max - stats.history.yearRange.min + 1}
              년간의 기록
            </div>
          </div>
        </div>

        {/* 배너뉴스 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.bannerNews.total}</div>
          <div className="stat-label">배너뉴스</div>
          <div className="mt-2 text-sm text-gray-500">
            활성: {stats.bannerNews.active} | 비활성:{" "}
            {stats.bannerNews.inactive}
          </div>
          <div className="mt-2">
            <div className="flex gap-2">
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                활성 {stats.bannerNews.active}
              </span>
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                비활성 {stats.bannerNews.inactive}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 빠른 액션 */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn btn-primary">
            <span>📝</span>새 할일 추가
          </button>
          <button className="btn btn-secondary">
            <span>👥</span>
            조직도 관리
          </button>
          <button className="btn btn-success">
            <span>📅</span>
            히스토리 추가
          </button>
          <button className="btn btn-warning">
            <span>📰</span>
            배너뉴스 등록
          </button>
        </div>
      </section>

      {/* 최근 활동 */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">최근 활동</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">새로운 할일이 추가되었습니다</span>
            <span className="text-xs text-gray-500 ml-auto">방금 전</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">조직도가 업데이트되었습니다</span>
            <span className="text-xs text-gray-500 ml-auto">5분 전</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm">배너뉴스가 활성화되었습니다</span>
            <span className="text-xs text-gray-500 ml-auto">10분 전</span>
          </div>
        </div>
      </section>

      {/* 시스템 상태 */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">시스템 상태</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div className="font-medium text-green-800">데이터베이스</div>
              <div className="text-sm text-green-600">정상 작동</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <div className="font-medium text-blue-800">API 서버</div>
              <div className="text-sm text-blue-600">정상 작동</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <div>
              <div className="font-medium text-purple-800">웹 서버</div>
              <div className="text-sm text-purple-600">정상 작동</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
