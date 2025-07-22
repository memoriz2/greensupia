"use client";

interface TodoDonutChartProps {
  completed: number; // 완료된 Todo 개수
  total: number; // 전체 Todo 개수
}

export default function TodoDonutChart({
  completed,
  total,
}: TodoDonutChartProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <figure
      className="donut-chart"
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        aria-hidden="true"
        focusable="false"
      >
        {/* 배경 원 */}
        <circle
          cx="15"
          cy="15"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="donut-background"
        />
        {/* 진행률 원 */}
        <circle
          cx="15"
          cy="15"
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 15 15)"
          className="donut-progress"
        />
      </svg>
      {/* 중앙 텍스트 - 0%일 때는 표시하지 않음 */}
      {total > 0 && (
        <figcaption
          className="donut-text"
          aria-label={`완료율: ${Math.round(percentage)}%`}
        >
          {Math.round(percentage)}%
        </figcaption>
      )}
    </figure>
  );
}
