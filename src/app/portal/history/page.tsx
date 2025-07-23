"use client";

import { useState, useEffect } from "react";

interface History {
  id: number;
  title: string;
  content: string;
  year: number;
  month: number;
  day: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HistoryPage() {
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/history");
      if (!response.ok) {
        throw new Error("히스토리 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setHistories(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
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
        <h2 className="text-xl font-semibold mb-4">히스토리 관리</h2>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">히스토리 관리</h1>
        <button className="btn btn-primary">+ 새 히스토리 추가</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>내용</th>
                <th>날짜</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((history) => (
                <tr key={history.id}>
                  <td className="max-w-xs truncate">{history.title}</td>
                  <td className="max-w-md truncate">{history.content}</td>
                  <td>{`${history.year}-${history.month
                    .toString()
                    .padStart(2, "0")}-${history.day
                    .toString()
                    .padStart(2, "0")}`}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        history.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {history.isActive ? "활성" : "비활성"}
                    </span>
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
