"use client";

import { useState, useEffect } from "react";

interface BannerNews {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  linkUrl: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BannerNewsPage() {
  const [bannerNews, setBannerNews] = useState<BannerNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBannerNews();
  }, []);

  const fetchBannerNews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/banner-news");
      if (!response.ok) {
        throw new Error("배너뉴스 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setBannerNews(data.data || []);
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
        <h2 className="text-xl font-semibold mb-4">배너뉴스 관리</h2>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">배너뉴스 관리</h1>
        <button className="btn btn-primary">+ 새 배너뉴스 추가</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>내용</th>
                <th>이미지</th>
                <th>링크</th>
                <th>기간</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {bannerNews.map((news) => (
                <tr key={news.id}>
                  <td className="max-w-xs truncate">{news.title}</td>
                  <td className="max-w-md truncate">{news.content}</td>
                  <td>
                    {news.imageUrl ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    {news.linkUrl ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    <div className="text-sm">
                      <div>{new Date(news.startDate).toLocaleDateString()}</div>
                      <div className="text-gray-500">~</div>
                      <div>{new Date(news.endDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        news.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {news.isActive ? "활성" : "비활성"}
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
