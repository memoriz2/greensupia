"use client";

import { useState, useEffect } from "react";
import { BannerNews } from "@/types/bannerNews";

export default function PublicHomePage() {
  const [bannerNews, setBannerNews] = useState<BannerNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBannerNews = async () => {
      try {
        const response = await fetch("/api/banner-news?action=active");
        const data = await response.json();
        setBannerNews(data);
      } catch (error) {
        console.error("배너 뉴스 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerNews();
  }, []);

  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <section
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1
              id="hero-heading"
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              JSEO에 오신 것을 환영합니다
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              혁신적인 솔루션으로 비즈니스의 성장을 돕습니다
            </p>
            <nav className="space-x-4" aria-label="히어로 섹션 액션">
              <a
                href="/about"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                aria-label="회사 소개 페이지로 이동"
              >
                회사 소개
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                aria-label="문의 페이지로 이동"
              >
                문의하기
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* 배너 뉴스 섹션 */}
      {!loading && bannerNews.length > 0 && (
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-labelledby="news-heading"
        >
          <h2
            id="news-heading"
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            최신 소식
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
          >
            {bannerNews.slice(0, 3).map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                role="listitem"
              >
                {news.imageUrl && (
                  <figure className="h-32 bg-gray-200">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </figure>
                )}
                <div className="p-6">
                  <header>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {news.title}
                    </h3>
                    <time
                      className="text-sm text-gray-500"
                      dateTime={new Date(news.createdAt).toISOString()}
                    >
                      {new Date(news.createdAt).toLocaleDateString("ko-KR")}
                    </time>
                  </header>
                  <p className="text-gray-600 mt-3 line-clamp-3">
                    {news.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 회사 소개 섹션 */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-labelledby="about-heading"
      >
        <div className="text-center">
          <h2
            id="about-heading"
            className="text-3xl font-bold text-gray-900 mb-6"
          >
            JSEO 소개
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            JSEO는 혁신적인 기술 솔루션을 통해 고객의 디지털 성공을 돕는 전문
            기업입니다. 최신 기술 트렌드를 반영한 맞춤형 서비스로 비즈니스의
            지속적인 성장을 지원합니다.
          </p>
        </div>
      </section>

      {/* 서비스 섹션 */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-labelledby="services-heading"
      >
        <h2
          id="services-heading"
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          주요 서비스
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              웹 개발
            </h3>
            <p className="text-gray-600">
              최신 기술을 활용한 반응형 웹사이트 및 웹 애플리케이션 개발
            </p>
          </article>

          <article className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              모바일 앱
            </h3>
            <p className="text-gray-600">
              iOS 및 Android 플랫폼을 위한 네이티브 및 크로스플랫폼 앱 개발
            </p>
          </article>

          <article className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              데이터 분석
            </h3>
            <p className="text-gray-600">
              빅데이터 분석 및 비즈니스 인텔리전스 솔루션 제공
            </p>
          </article>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JSEO</h3>
              <p className="text-gray-400">
                혁신적인 기술 솔루션으로 비즈니스의 성장을 돕습니다.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li>웹 개발</li>
                <li>모바일 앱</li>
                <li>데이터 분석</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li>회사 소개</li>
                <li>팀</li>
                <li>채용</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">연락처</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@jseo.shop</li>
                <li>+82-2-1234-5678</li>
                <li>서울특별시 강남구</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JSEO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
