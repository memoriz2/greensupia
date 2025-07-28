"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BannerNews } from "@/types/bannerNews";

// CSS 애니메이션을 위한 스타일
const animationStyles = `
  @keyframes pulse-delay-2 {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes pulse-delay-4 {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Banner {
  id: number;
  title: string;
  fileName: string;
  filePath: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Greeting {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GreensupiaHomePage() {
  const [video, setVideo] = useState<Video | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [bannerNews, setBannerNews] = useState<BannerNews[] | null>(null);

  useEffect(() => {
    // CSS 스타일 주입
    const style = document.createElement("style");
    style.textContent = animationStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 배너 데이터 가져오기
        try {
          const bannerResponse = await fetch("/api/banners?action=active");
          if (bannerResponse.ok) {
            const bannerData = await bannerResponse.json();
            console.log("배너 데이터:", bannerData);
            // 배열의 첫 번째 항목 사용
            if (
              bannerData &&
              Array.isArray(bannerData) &&
              bannerData.length > 0
            ) {
              const firstBanner = bannerData[0];
              console.log("첫 번째 배너:", firstBanner);
              console.log("배너 이미지 URL:", firstBanner.imageUrl);

              // 이미지 URL이 있으면 배너 설정
              if (firstBanner.imageUrl) {
                setBanner(firstBanner);
              } else {
                console.log("배너 이미지 URL이 없습니다.");
              }
            } else {
              console.log("배너 데이터가 비어있습니다.");
            }
          }
        } catch (bannerError) {
          console.log("배너 데이터를 불러올 수 없습니다:", bannerError);
        }

        // 비디오 데이터 가져오기
        try {
          const videoResponse = await fetch("/api/videos?action=active");
          if (videoResponse.ok) {
            const videoData = await videoResponse.json();
            console.log("비디오 데이터:", videoData);
            // 배열의 첫 번째 항목 사용
            if (videoData && Array.isArray(videoData) && videoData.length > 0) {
              setVideo(videoData[0]);
            }
          }
        } catch (videoError) {
          console.log("비디오 데이터를 불러올 수 없습니다:", videoError);
        }

        // 인사말 데이터 가져오기
        try {
          const greetingResponse = await fetch("/api/greetings?action=active");
          if (greetingResponse.ok) {
            const greetingData = await greetingResponse.json();
            console.log("인사말 데이터:", greetingData);
            // 배열의 첫 번째 항목 사용
            if (
              greetingData &&
              Array.isArray(greetingData) &&
              greetingData.length > 0
            ) {
              setGreeting(greetingData[0]);
            }
          }
        } catch (greetingError) {
          console.log("인사말 데이터를 불러올 수 없습니다:", greetingError);
        }

        // 배너뉴스 데이터 가져오기
        try {
          const bannerNewsResponse = await fetch(
            "/api/banner-news?action=active"
          );
          if (bannerNewsResponse.ok) {
            const bannerNewsData = await bannerNewsResponse.json();
            console.log("배너뉴스 데이터:", bannerNewsData);
            setBannerNews(bannerNewsData || []);
          }
        } catch (bannerNewsError) {
          console.log("배너뉴스 데이터를 불러올 수 없습니다:", bannerNewsError);
          setBannerNews([]);
        }
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다:", error);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">Greensupia</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/greensupia"
                className="text-gray-900 hover:text-green-600 transition-colors"
              >
                홈
              </Link>
              <Link
                href="/greensupia/services"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                서비스
              </Link>
              <Link
                href="/greensupia/projects"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                프로젝트
              </Link>
              <Link
                href="/greensupia/contact"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                문의
              </Link>
            </nav>
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-green-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 배너 섹션 */}
        {banner && banner.imageUrl && (
          <section className="mb-12">
            <div
              className="greensupia-banner"
              style={{
                backgroundImage: `url(${banner.imageUrl})`,
              }}
            >
              <div className="greensupia-banner__overlay"></div>
              <div className="greensupia-banner__content">
                <h2>{banner.title}</h2>
                <p>혁신적인 웹 개발로 비즈니스 성장을 이끌어드립니다</p>
              </div>
            </div>
          </section>
        )}

        {/* 기본 히어로 섹션 (배너가 없을 때) */}
        {!banner && (
          <section className="mb-12 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20 rounded-lg relative overflow-hidden">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                혁신적인 웹 개발로
                <span className="text-green-600"> 비즈니스 성장</span>을
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                최신 기술과 창의적인 디자인으로 귀사의 디지털 전환을
                이끌어드립니다. 사용자 중심의 웹사이트와 웹 애플리케이션으로
                비즈니스 가치를 극대화하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/greensupia/contact"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  무료 견적 받기
                </Link>
                <Link
                  href="/greensupia/projects"
                  className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  프로젝트 보기
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 인사말 섹션 */}
        {greeting && (
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {greeting.title}
            </h2>
            <div
              className="max-w-4xl mx-auto prose prose-lg"
              dangerouslySetInnerHTML={{ __html: greeting.content }}
            />
          </section>
        )}

        {/* 배너뉴스 섹션 */}
        {bannerNews && bannerNews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              최신 소식
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bannerNews.slice(0, 3).map((news) => (
                <article
                  key={news.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  {news.imageUrl && (
                    <div className="h-48 bg-gray-200">
                      <Image
                        src={news.imageUrl}
                        alt={news.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover"
                        priority={true}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {news.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {news.startDate
                          ? new Date(news.startDate).toLocaleDateString("ko-KR")
                          : "날짜 없음"}
                      </span>
                      {news.linkUrl && (
                        <a
                          href={news.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          자세히 보기 →
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 서비스 섹션 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            전문 서비스
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 웹사이트 개발 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-green-600"
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
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                웹사이트 개발
              </h4>
              <p className="text-gray-600 mb-4">
                반응형 웹사이트부터 복잡한 웹 애플리케이션까지, 최신 기술로
                사용자 경험을 극대화합니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 반응형 웹 디자인</li>
                <li>• SEO 최적화</li>
                <li>• 빠른 로딩 속도</li>
              </ul>
            </div>

            {/* 웹 애플리케이션 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                웹 애플리케이션
              </h4>
              <p className="text-gray-600 mb-4">
                React, Next.js 등 최신 프레임워크를 활용한 고성능 웹
                애플리케이션을 개발합니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• React/Next.js 개발</li>
                <li>• TypeScript 적용</li>
                <li>• 상태 관리 최적화</li>
              </ul>
            </div>

            {/* 유지보수 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                유지보수 & 호스팅
              </h4>
              <p className="text-gray-600 mb-4">
                개발 완료 후에도 안정적인 운영을 위한 유지보수와 호스팅 서비스를
                제공합니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 24/7 모니터링</li>
                <li>• 정기 업데이트</li>
                <li>• 보안 패치</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 비디오 섹션 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            회사 소개 영상
          </h2>
          {video ? (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-gray-600 mb-6 text-center">
                  {video.description}
                </p>
              )}
              <div className="max-w-4xl mx-auto">
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <div
                    className="absolute inset-0"
                    dangerouslySetInnerHTML={{ __html: video.youtubeUrl }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-600">
              비디오가 없습니다.
            </div>
          )}
        </section>

        {/* CTA 섹션 */}
        <section className="mb-12 bg-green-600 rounded-lg py-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              프로젝트를 시작해보세요
            </h3>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              무료 상담을 통해 귀사의 비즈니스에 최적화된 웹 개발 솔루션을
              제안해드립니다.
            </p>
            <Link
              href="/greensupia/contact"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              무료 상담 신청
            </Link>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold text-green-400 mb-4">
                Greensupia
              </h4>
              <p className="text-gray-400">
                혁신적인 웹 개발로 비즈니스의 디지털 성장을 이끌어드립니다.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">서비스</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/greensupia/services"
                    className="hover:text-white transition-colors"
                  >
                    웹사이트 개발
                  </Link>
                </li>
                <li>
                  <Link
                    href="/greensupia/services"
                    className="hover:text-white transition-colors"
                  >
                    웹 애플리케이션
                  </Link>
                </li>
                <li>
                  <Link
                    href="/greensupia/services"
                    className="hover:text-white transition-colors"
                  >
                    유지보수
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">회사</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/greensupia/projects"
                    className="hover:text-white transition-colors"
                  >
                    프로젝트
                  </Link>
                </li>
                <li>
                  <Link
                    href="/greensupia/contact"
                    className="hover:text-white transition-colors"
                  >
                    문의하기
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">연락처</h5>
              <div className="text-gray-400">
                <p>이메일: info@greensupia.com</p>
                <p>전화: 02-1234-5678</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Greensupia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
