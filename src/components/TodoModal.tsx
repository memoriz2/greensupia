"use client";

import React, { useState, useEffect } from "react";
import { Todo } from "@/types/todo";
import { formatDate } from "@/utils/date";
import { validateTodoTitle, validateTodoLimit } from "@/utils/validation";
import { CALENDAR_CONFIG } from "@/config/constants";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onTodoToggle: (
    todoId: number
  ) => Promise<{ success: boolean; error?: string }>;
  onTodoCreate: (
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; error?: string }>;
}

const TodoModal = React.memo(
  ({
    isOpen,
    onClose,
    selectedDate,
    todos,
    loading,
    error,
    onTodoToggle,
    onTodoCreate,
  }: TodoModalProps) => {
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (!isOpen) {
        setNewTodoTitle("");
        setValidationErrors([]);
      }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedDate) return;

      // 입력 검증
      const titleValidation = validateTodoTitle(newTodoTitle);
      const limitValidation = validateTodoLimit(todos.length);

      const allErrors = [...titleValidation.errors, ...limitValidation.errors];
      setValidationErrors(allErrors);

      if (allErrors.length > 0) return;

      setIsSubmitting(true);
      try {
        const result = await onTodoCreate({
          title: newTodoTitle.trim(),
          description: "",
          completed: false,
          priority: "MEDIUM",
          dueDate: selectedDate,
        });

        if (result.success) {
          setNewTodoTitle("");
          setValidationErrors([]);
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleTodoToggle = async (todoId: number) => {
      await onTodoToggle(todoId);
    };

    if (!isOpen || !selectedDate) return null;

    return (
      <dialog
        className="modal-overlay"
        open={isOpen}
        onClick={onClose}
        aria-label={`${formatDate(selectedDate)} 할 일 관리`}
      >
        <article className="modal-content" onClick={(e) => e.stopPropagation()}>
          <header className="modal-header">
            <h2>{formatDate(selectedDate)}</h2>
            <button
              className="close-button"
              onClick={onClose}
              aria-label="모달 닫기"
              disabled={isSubmitting}
            >
              ×
            </button>
          </header>

          <main className="modal-body">
            {/* 에러 메시지 */}
            <ErrorMessage
              error={error}
              onRetry={() => window.location.reload()}
            />

            {/* 새 Todo 추가 */}
            <section className="add-todo-section">
              <h3 className="visually-hidden">새 할 일 추가</h3>
              <form onSubmit={handleSubmit} className="add-todo-form">
                <label htmlFor="new-todo" className="visually-hidden">
                  새 할 일
                </label>
                <input
                  id="new-todo"
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="새 할 일 추가..."
                  className="todo-input"
                  disabled={isSubmitting || loading}
                  maxLength={CALENDAR_CONFIG.MAX_TITLE_LENGTH}
                />
                <button
                  type="submit"
                  className="add-button"
                  disabled={isSubmitting || loading || !newTodoTitle.trim()}
                >
                  {isSubmitting ? <LoadingSpinner size="small" /> : "추가"}
                </button>
              </form>

              {/* 검증 에러 메시지 */}
              {validationErrors.length > 0 && (
                <ul className="validation-errors" role="alert">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="validation-error">
                      {error}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Todo 목록 */}
            <section className="todo-list-section">
              <h3>할 일 목록 ({todos.length}개)</h3>
              {loading ? (
                <LoadingSpinner message="할 일을 불러오는 중..." />
              ) : todos.length > 0 ? (
                <ul className="todo-list" aria-label="할 일 목록">
                  {todos.map((todo) => (
                    <li key={todo.id} className="todo-item">
                      <input
                        type="checkbox"
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onChange={() => handleTodoToggle(todo.id)}
                        className="todo-checkbox"
                        disabled={loading}
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`todo-title ${
                          todo.completed ? "completed" : ""
                        }`}
                      >
                        {todo.title}
                      </label>
                      <span
                        className={`priority-badge priority-${todo.priority.toLowerCase()}`}
                      >
                        {todo.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-todos">등록된 할 일이 없습니다.</p>
              )}
            </section>
          </main>
        </article>
      </dialog>
    );
  }
);

TodoModal.displayName = "TodoModal";

export default TodoModal;
