"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { AnimatedNumber } from "@/components/AnimatedNumber";

interface DashboardStats {
  // 방문자 통계 (새로 추가)
  visitors: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  searchBots: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    topBots: { name: string; count: number }[];
  };
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
  const [userType, setUserType] = useState<string>("guest");
  const [loading, setLoading] = useState(true);

  // 실시간 통계 훅 사용
  const { data: visitorStats, loading: visitorLoading } = useRealtimeStats(
    () => fetch("/api/stats/visitors").then((res) => res.json()),
    { intervalMs: 120000, enabled: true } // 2분마다 업데이트
  );

  const { data: searchBotStats, loading: searchBotLoading } = useRealtimeStats(
    () => fetch("/api/stats/searchbots").then((res) => res.json()),
    { intervalMs: 120000, enabled: true }
  );

  // 마지막 업데이트 시간 표시
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  useEffect(() => {
    if (visitorStats || searchBotStats) {
      setLastUpdateTime(new Date());
    }
  }, [visitorStats, searchBotStats]);

  // 통계 데이터 통합
  const stats: DashboardStats = {
    visitors: visitorStats || { total: 0, today: 0, thisWeek: 0, thisMonth: 0 },
    searchBots: searchBotStats || {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      topBots: [],
    },
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
  };

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

    fetchUserInfo();
    setLoading(false);
  }, []);

  if (loading || visitorLoading || searchBotLoading) {
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
            ? "시스템 현황을 한눈에 확인하세요 (2분마다 자동 업데이트)"
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
            <>
              <span className="realtime-status">
                🔄 실시간 업데이트 활성화
                <span className="last-update-time">
                  (마지막 업데이트: {lastUpdateTime.toLocaleTimeString()})
                </span>
              </span>
              <button onClick={handleLogout} className="logout-button">
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>

      {/* 방문자 통계 (상단 2개 큰 카드) */}
      <section className="visitor-stats-section" aria-label="방문자 통계">
        {/* 방문자 수 카드 */}
        <div className="card card-visitor-stats">
          <div className="stat-accent-line"></div>
          <div className="visitor-stat-header">
            <div className="visitor-icon">👥</div>
            <div className="visitor-title">방문자 통계</div>
          </div>
          <div className="visitor-main-number">
            <AnimatedNumber value={stats.visitors.total} />
          </div>
          <div className="visitor-main-label">총 방문자</div>
          <div className="visitor-details">
            <div className="visitor-period">
              <span className="period-label">오늘</span>
              <span className="period-value">{stats.visitors.today}</span>
            </div>
            <div className="visitor-period">
              <span className="period-label">이번 주</span>
              <span className="period-value">{stats.visitors.thisWeek}</span>
            </div>
            <div className="visitor-period">
              <span className="period-label">이번 달</span>
              <span className="period-value">{stats.visitors.thisMonth}</span>
            </div>
          </div>
        </div>

        {/* 검색봇 방문 수 카드 */}
        <div className="card card-visitor-stats">
          <div className="stat-accent-line"></div>
          <div className="visitor-stat-header">
            <div className="visitor-icon">🤖</div>
            <div className="visitor-title">검색봇 방문</div>
          </div>
          <div className="visitor-main-number">
            <AnimatedNumber value={stats.searchBots.total} />
          </div>
          <div className="visitor-main-label">총 봇 방문</div>
          <div className="visitor-details">
            <div className="visitor-period">
              <span className="period-label">오늘</span>
              <span className="period-value">{stats.searchBots.today}</span>
            </div>
            <div className="visitor-period">
              <span className="period-label">이번 주</span>
              <span className="period-value">{stats.searchBots.thisWeek}</span>
            </div>
            <div className="visitor-period">
              <span className="period-label">이번 달</span>
              <span className="period-value">{stats.searchBots.thisMonth}</span>
            </div>
          </div>
          <div className="bot-tags">
            <div className="tag-container">
                                      {stats.searchBots.topBots.slice(0, 3).map((bot, index) => (
                          <span key={index} className="bot-tag">
                            {bot.name}
                          </span>
                        ))}
              {stats.searchBots.topBots.length > 3 && (
                <span className="bot-tag-more">
                  +{stats.searchBots.topBots.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

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
