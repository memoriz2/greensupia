"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  notices: {
    total: number;
    pinned: number;
    active: number;
    inactive: number;
  };
  inquiries: {
    total: number;
    pending: number;
    answered: number;
    secret: number;
    public: number;
    answerRate: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string>("guest");

  const router = useRouter();

  const handleButtonClick = () => {
    if (userType === "guest") {
      router.push("/portal/login");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUserType("guest");
      // 로그아웃 후 페이지 새로고침
      window.location.reload();
    } catch (err) {
      console.error("로그아웃 오류:", err);
      setUserType("guest");
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUserType(data.userType || "guest");
      } else {
        setUserType("guest");
      }
    } catch (err) {
      console.error("사용자 정보 가져오기 실패:", err);
      setUserType("guest");
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 서버에서 사용자 정보 가져오기
        await fetchUserInfo();

        // 각 API에서 기본 데이터 가져오기
        const [
          todoData,
          orgData,
          historyData,
          bannerData,
          noticeData,
          inquiryStats,
        ] = await Promise.all([
          fetch("/api/todos").then((res) => res.json()),
          fetch("/api/organization").then((res) => res.json()),
          fetch("/api/history").then((res) => res.json()),
          fetch("/api/banner-news").then((res) => res.json()),
          fetch("/api/notices").then((res) => res.json()),
          fetch("/api/inquiries/stats").then((res) => res.json()),
        ]);

        // 데이터를 기반으로 통계 계산
        const todos = Array.isArray(todoData) ? todoData : [];
        const organization = Array.isArray(orgData) ? orgData : [];
        const history = Array.isArray(historyData) ? historyData : [];
        const bannerNews = Array.isArray(bannerData) ? bannerData : [];
        const notices = noticeData?.data?.notices || [];
        const inquiryStatsData = inquiryStats?.data || {
          total: 0,
          pending: 0,
          secret: 0,
        };

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
          notices: {
            total: notices.length,
            pinned: notices.filter(
              (notice: { isPinned: boolean }) => notice.isPinned
            ).length,
            active: notices.filter(
              (notice: { isActive: boolean }) => notice.isActive
            ).length,
            inactive: notices.filter(
              (notice: { isActive: boolean }) => !notice.isActive
            ).length,
          },
          inquiries: {
            total: inquiryStatsData.total || 0,
            pending: inquiryStatsData.pending || 0,
            answered:
              (inquiryStatsData.total || 0) - (inquiryStatsData.pending || 0),
            secret: inquiryStatsData.secret || 0,
            public:
              (inquiryStatsData.total || 0) - (inquiryStatsData.secret || 0),
            answerRate:
              inquiryStatsData.total > 0
                ? Math.round(
                    ((inquiryStatsData.total - inquiryStatsData.pending) /
                      inquiryStatsData.total) *
                      100
                  )
                : 0,
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
          notices: { total: 0, pinned: 0, active: 0, inactive: 0 },
          inquiries: {
            total: 0,
            pending: 0,
            answered: 0,
            secret: 0,
            public: 0,
            answerRate: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="dashboard-loading" aria-label="로딩 중">
        <div className="loading-text" role="status" aria-live="polite">
          📊 대시보드 데이터를 불러오는 중...
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="dashboard-error" role="alert" aria-live="assertive">
        <p>데이터를 불러올 수 없습니다.</p>
      </section>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {userType === "admin" ? "관리자" : "게스트"} 대시보드
        </h1>

        <p className="dashboard-subtitle">
          {userType === "admin"
            ? "시스템 현황을 한눈에 확인하세요"
            : "읽기 전용 모드로 시스템 현황을 확인하세요"}
        </p>
        <div className="dashboard-status">
          <span
            className={`status-badge ${
              userType === "admin" ? "status-admin" : "status-guest"
            }`}
          >
            {userType === "admin" ? "관리자 권한" : "게스트 권한"}
          </span>
          {userType === "admin" && (
            <button onClick={handleLogout} className="logout-button">
              로그아웃
            </button>
          )}
        </div>
      </div>

      {/* 통계 카드들 */}
      <section className="stats-section" aria-label="시스템 통계">
        {/* Todo 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.todos.total}</div>
          <div className="stat-label">전체 할일</div>
          <div className="stat-details">
            완료: {stats.todos.completed} | 진행중: {stats.todos.pending}
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stats.todos.completionRate}%` }}
              ></div>
            </div>
            <div className="progress-text">
              완료율: {stats.todos.completionRate}%
            </div>
          </div>
        </div>

        {/* 조직도 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.organization.total}</div>
          <div className="stat-label">조직 구성원</div>
          <div className="stat-details">
            부서: {stats.organization.departments?.length || 0}개
          </div>
          <div className="department-tags">
            <div className="tag-container">
              {stats.organization.departments
                ?.slice(0, 3)
                .map((dept, index) => (
                  <span key={index} className="department-tag">
                    {dept}
                  </span>
                ))}
              {(stats.organization.departments?.length || 0) > 3 && (
                <span className="department-tag-more">
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
          <div className="stat-details">
            {stats.history.yearRange.min} - {stats.history.yearRange.max}
          </div>
          <div className="history-info">
            <div className="status-text">
              총 {stats.history.yearRange.max - stats.history.yearRange.min + 1}
              년간의 기록
            </div>
          </div>
        </div>

        {/* 배너뉴스 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.bannerNews.total}</div>
          <div className="stat-label">배너뉴스</div>
          <div className="stat-details">
            활성: {stats.bannerNews.active} | 비활성:{" "}
            {stats.bannerNews.inactive}
          </div>
          <div className="status-tags">
            <div className="tag-container">
              <span className="status-tag status-active">
                활성 {stats.bannerNews.active}
              </span>
              <span className="status-tag status-inactive">
                비활성 {stats.bannerNews.inactive}
              </span>
            </div>
          </div>
        </div>

        {/* 공지사항 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.notices.total}</div>
          <div className="stat-label">공지사항</div>
          <div className="stat-details">
            고정: {stats.notices.pinned} | 활성: {stats.notices.active} |
            비활성: {stats.notices.inactive}
          </div>
          <div className="status-tags">
            <div className="tag-container">
              <span className="status-tag status-pinned">
                고정 {stats.notices.pinned}
              </span>
              <span className="status-tag status-active">
                활성 {stats.notices.active}
              </span>
              <span className="status-tag status-inactive">
                비활성 {stats.notices.inactive}
              </span>
            </div>
          </div>
        </div>

        {/* 문의글 통계 */}
        <div className="card card-stats">
          <div className="stat-number">{stats.inquiries.total}</div>
          <div className="stat-label">문의글</div>
          <div className="stat-details">
            답변대기: {stats.inquiries.pending} | 답변완료:{" "}
            {stats.inquiries.answered}
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill progress-success"
                style={{ width: `${stats.inquiries.answerRate}%` }}
              ></div>
            </div>
            <div className="progress-text">
              답변율: {stats.inquiries.answerRate}%
            </div>
          </div>
          <div className="inquiry-tags">
            <div className="tag-container">
              <span className="status-tag status-secret">
                비밀글 {stats.inquiries.secret}
              </span>
              <span className="status-tag status-public">
                일반글 {stats.inquiries.public}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 빠른 액션 */}
      <section className="action-section card card-stats">
        <h2 className="section-title">
          {userType === "admin" ? "빠른 액션" : "메뉴"}
        </h2>
        <div className="action-buttons">
          {userType === "admin" ? (
            <>
              <Link
                href="/portal/banner"
                className="action-button action-primary"
              >
                <span>🎨</span>배너 관리
              </Link>
              <Link
                href="/portal/organization"
                className="action-button action-secondary"
              >
                <span>👥</span>
                조직도 관리
              </Link>
              <Link
                href="/portal/history"
                className="action-button action-success"
              >
                <span>📅</span>
                히스토리 추가
              </Link>
              <Link
                href="/portal/banner-news"
                className="action-button action-warning"
              >
                <span>📰</span>
                배너
              </Link>
              <Link
                href="/portal/notices"
                className="action-button action-info"
              >
                <span>📢</span>
                공지사항 관리
              </Link>
            </>
          ) : (
            <>
              <button
                className="action-button action-primary action-disabled"
                onClick={handleButtonClick}
              >
                <span>🎨</span>배너 관리
              </button>
              <button
                className="action-button action-secondary action-disabled"
                onClick={handleButtonClick}
              >
                <span>👥</span>
                조직도 관리
              </button>
              <button
                className="action-button action-success action-disabled"
                onClick={handleButtonClick}
              >
                <span>📅</span>
                히스토리 추가
              </button>
              <button
                className="action-button action-warning action-disabled"
                onClick={handleButtonClick}
              >
                <span>📰</span>
                배너
              </button>
              <button
                className="action-button action-info action-disabled"
                onClick={handleButtonClick}
              >
                <span>📢</span>
                공지사항 관리
              </button>
            </>
          )}
          {userType === "admin" ? (
            <>
              <Link
                href="/portal/inquiry"
                className="action-button action-purple"
              >
                <span>💬</span>
                문의글 관리
              </Link>
              <Link
                href="/portal/admin/add"
                className="action-button action-dark"
              >
                <span>👤</span>
                관리자 추가
              </Link>
            </>
          ) : (
            <>
              <button
                className="action-button action-purple action-disabled"
                onClick={handleButtonClick}
              >
                <span>💬</span>
                문의글 관리
              </button>
              <button
                className="action-button action-dark action-disabled"
                onClick={handleButtonClick}
              >
                <span>👤</span>
                관리자 추가
              </button>
            </>
          )}
        </div>
        {userType === "guest" && (
          <div className="guest-notice">
            <p className="guest-notice-text">
              💡 편집 기능을 사용하려면 버튼을 클릭하여 관리자로 로그인하세요.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
