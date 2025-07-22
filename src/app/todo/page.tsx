"use client";

import { useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Calendar from "@/components/Calendar";
import TodoModal from "@/components/TodoModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { useCalendar } from "@/hooks/useCalendar";
import { useTodos } from "@/hooks/useTodos";
import { isSameDate } from "@/utils/date";

export default function TodoPage() {
  const {
    currentDate,
    selectedDate,
    isModalOpen,
    goToPreviousMonth,
    goToNextMonth,
    openModal,
    closeModal,
  } = useCalendar();

  const { todos, loading, error, fetchTodos, createTodo, toggleTodo } =
    useTodos();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleDayClick = (date: Date) => {
    openModal(date);
  };

  const selectedDateTodos = selectedDate
    ? todos.filter(
        (todo) => todo.dueDate && isSameDate(todo.dueDate, selectedDate)
      )
    : [];

  if (loading && todos.length === 0) {
    return (
      <div className="todo-calendar-page">
        <h1>📅 Todo 캘린더</h1>
        <LoadingSpinner message="달력을 불러오는 중..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="todo-calendar-page">
        <h1>📅 Todo 캘린더</h1>

        <ErrorMessage error={error} onRetry={fetchTodos} />

        <Calendar
          todos={todos}
          currentDate={currentDate}
          onDayClick={handleDayClick}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        <TodoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedDate={selectedDate}
          todos={selectedDateTodos}
          loading={loading}
          error={error}
          onTodoToggle={toggleTodo}
          onTodoCreate={createTodo}
        />
      </div>
    </ErrorBoundary>
  );
}
