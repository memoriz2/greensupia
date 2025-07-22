"use client";

interface CalendarHeaderProps {
  currentDate: Date; // 현재 선택된 날짜
  onPrevious: () => void; // 이전 월 버튼 클릭 시 호출될 함수
  onNext: () => void; // 다음 월 버튼 클릭 시 호출될 함수
}

export default function CalendarHeader({
  currentDate,
  onPrevious,
  onNext,
}: CalendarHeaderProps) {
  return (
    <header className="calendar-header">
      {/* 이전 월 버튼 */}
      <button
        onClick={onPrevious}
        className="month-nav-button"
        aria-label="이전 월"
      >
        ←
      </button>

      {/* 현재 년도와 월 표시 */}
      <h2 className="current-month">
        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
      </h2>

      {/* 다음 월 버튼 */}
      <button
        onClick={onNext}
        className="month-nav-button"
        aria-label="다음 월"
      >
        →
      </button>
    </header>
  );
}
