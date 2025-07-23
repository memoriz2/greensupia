"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error("Todo 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setTodos(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: "PATCH",
      });
      if (response.ok) {
        fetchTodos(); // 목록 새로고침
      }
    } catch (err) {
      console.error("Todo 토글 실패:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Todo 관리</h2>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Todo 관리</h1>
        <button className="btn btn-primary">+ 새 Todo 추가</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>설명</th>
                <th>날짜</th>
                <th>완료 상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id}>
                  <td className="max-w-xs truncate">{todo.title}</td>
                  <td className="max-w-md truncate">
                    {todo.description || "-"}
                  </td>
                  <td>{new Date(todo.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        todo.completed
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {todo.completed ? "완료" : "미완료"}
                    </button>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="btn btn-outline btn-sm">수정</button>
                      <button className="btn btn-secondary btn-sm">삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
