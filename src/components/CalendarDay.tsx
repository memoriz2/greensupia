"use client";

import React from "react";
import { Todo } from "@/types/todo";
import TodoDonutChart from "./TodoDonutChart";
import { getDateKey } from "@/utils/date";
import { CALENDAR_CONFIG } from "@/config/constants";

interface CalendarDayProps {
  date: Date;
  todos: Todo[];
  isCurrentMonth: boolean;
  onClick: () => void;
}

const CalendarDay = React.memo(
  ({ date, todos, isCurrentMonth, onClick }: CalendarDayProps) => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    const totalCount = todos.length;

    return (
      <button
        className={`calendar-day ${!isCurrentMonth ? "other-month" : ""}`}
        onClick={onClick}
        aria-label={`${date.getFullYear()}년 ${
          date.getMonth() + 1
        }월 ${date.getDate()}일, Todo ${totalCount}개`}
      >
        {/* 날짜 번호 */}
        <time className="day-number" dateTime={getDateKey(date)}>
          {date.getDate()}
        </time>

        {/* Todo 목록 */}
        {totalCount > 0 && (
          <ul className="todo-list" aria-label="할 일 목록">
            {todos
              .slice(0, CALENDAR_CONFIG.TODOS_TO_SHOW_IN_CELL)
              .map((todo) => (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.completed ? "completed" : ""}`}
                  title={todo.title}
                >
                  {todo.title.length > 10
                    ? `${todo.title.substring(0, 10)}...`
                    : todo.title}
                </li>
              ))}
            {todos.length > CALENDAR_CONFIG.TODOS_TO_SHOW_IN_CELL && (
              <li
                className="todo-more"
                aria-label={`${
                  todos.length - CALENDAR_CONFIG.TODOS_TO_SHOW_IN_CELL
                }개의 추가 할 일`}
              >
                +{todos.length - CALENDAR_CONFIG.TODOS_TO_SHOW_IN_CELL}개 더
              </li>
            )}
          </ul>
        )}

        {/* 도넛 차트 */}
        {totalCount > 0 && (
          <div
            className="donut-chart-container"
            aria-label={`완료율: ${completedCount}/${totalCount}`}
          >
            <TodoDonutChart completed={completedCount} total={totalCount} />
          </div>
        )}
      </button>
    );
  }
);

CalendarDay.displayName = "CalendarDay";

export default CalendarDay;
