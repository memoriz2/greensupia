"use client";

import React, { useMemo } from "react";
import { Todo } from "@/types/todo";
import CalendarDay from "./CalendarDay";
import CalendarHeader from "./CalendarHeader";
import { getDateKey } from "@/utils/date";
import { CALENDAR_CONFIG } from "@/config/constants";

interface CalendarProps {
  todos: Todo[];
  currentDate: Date;
  onDayClick: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const Calendar = React.memo(
  ({
    todos,
    currentDate,
    onDayClick,
    onPreviousMonth,
    onNextMonth,
  }: CalendarProps) => {
    const calendarDays = useMemo(() => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const firstDay = new Date(year, month, 1);

      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());

      const days: Date[] = [];
      const current = new Date(startDate);

      let weekCount = 0;
      while (weekCount < CALENDAR_CONFIG.WEEKS_TO_SHOW) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);

        if (current.getDay() === 0) {
          weekCount++;
        }
      }

      return days;
    }, [currentDate]);

    // Todo들을 날짜별로 그룹화
    const todosByDate = useMemo(() => {
      const grouped: Record<string, Todo[]> = {};

      todos.forEach((todo) => {
        if (todo.dueDate) {
          const dateKey = getDateKey(todo.dueDate);
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(todo);
        }
      });

      return grouped;
    }, [todos]);

    return (
      <div className="calendar-container">
        <section className="calendar" aria-label="월간 Todo 달력">
          <CalendarHeader
            currentDate={currentDate}
            onPrevious={onPreviousMonth}
            onNext={onNextMonth}
          />

          <div className="calendar-table-wrapper">
            <table
              className="calendar-grid"
              role="grid"
              aria-label={`${currentDate.getFullYear()}년 ${
                currentDate.getMonth() + 1
              }월 달력`}
            >
              <thead>
                <tr>
                  {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <th key={day} scope="col" className="calendar-day-header">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  { length: CALENDAR_CONFIG.WEEKS_TO_SHOW },
                  (_, weekIndex) => (
                    <tr key={weekIndex}>
                      {calendarDays
                        .slice(weekIndex * 7, (weekIndex + 1) * 7)
                        .map((date, dayIndex) => (
                          <td key={dayIndex} className="calendar-day-cell">
                            <CalendarDay
                              date={date}
                              todos={todosByDate[getDateKey(date)] || []}
                              isCurrentMonth={
                                date.getMonth() === currentDate.getMonth()
                              }
                              onClick={() => onDayClick(date)}
                            />
                          </td>
                        ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }
);

Calendar.displayName = "Calendar";

export default Calendar;
