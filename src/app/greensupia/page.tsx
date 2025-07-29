"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BannerNews } from "@/types/bannerNews";

// Google Maps API 타입 선언
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (
          element: HTMLElement,
          options: {
            center: { lat: number; lng: number };
            zoom: number;
            styles?: Array<{
              featureType?: string;
              elementType?: string;
              stylers: Array<{ [key: string]: string | number | boolean }>;
            }>;
          }
        ) => {
          setZoom: (zoom: number) => void;
          setCenter: (center: { lat: number; lng: number }) => void;
        };
        Marker: new (options: {
          position: { lat: number; lng: number };
          map: {
            setZoom: (zoom: number) => void;
            setCenter: (center: { lat: number; lng: number }) => void;
          };
          title: string;
        }) => {
          setMap: (
            map: {
              setZoom: (zoom: number) => void;
              setCenter: (center: { lat: number; lng: number }) => void;
            } | null
          ) => void;
        };
      };
    };
  }
}

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
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  sortOrder: number;
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

interface OrganizationChart {
  id: number;
  fileName: string;
  filePath: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface History {
  id: number;
  year: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function GreensupiaHomePage() {
  const [video, setVideo] = useState<Video | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [bannerNews, setBannerNews] = useState<BannerNews[] | null>(null);
  const [organizationChart, setOrganizationChart] =
    useState<OrganizationChart | null>(null);
  const [histories, setHistories] = useState<History[]>([]);

  useEffect(() => {
    // CSS 스타일 주입
    const style = document.createElement("style");
    style.textContent = animationStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Google Maps API 로드 및 지도 초기화
  useEffect(() => {
    console.log("Google Maps API 초기화 시작");

    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyCJFR836cPFQxyZUE8bl375Cmkr3vBfAJ8";

    console.log("API 키 확인:", apiKey ? "설정됨" : "설정되지 않음");

    // API 키가 없으면 지도를 표시하지 않음
    if (!apiKey) {
      console.log("Google Maps API 키가 설정되지 않았습니다.");
      return;
    }

    // 지도 초기화 함수
    const initializeMap = () => {
      console.log("지도 초기화 함수 실행");
      const mapElement = document.getElementById("map");
      console.log("지도 엘리먼트:", mapElement);

      if (!mapElement) {
        console.log("map 엘리먼트를 찾을 수 없습니다. 2초 후 재시도...");
        setTimeout(initializeMap, 2000);
        return;
      }

      // 이미 스크립트가 있으면 추가하지 않음
      if (document.getElementById("google-maps-script")) {
        console.log("Google Maps 스크립트가 이미 로드되어 있습니다.");
        if (window.google && window.google.maps) {
          console.log("Google Maps 객체가 이미 존재합니다. 지도 생성 중...");
          createMap(mapElement);
        }
        return;
      }

      console.log("Google Maps 스크립트 로드 시작");
      const script: HTMLScriptElement = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps 스크립트 로드 완료");
        setTimeout(() => createMap(mapElement), 100);
      };
      script.onerror = () => {
        console.error("Google Maps API 로드 실패");
        showMapPlaceholder(mapElement);
      };
      document.head.appendChild(script);
    };

    function createMap(mapElement: HTMLElement) {
      console.log("지도 생성 함수 실행");
      console.log("Google Maps 객체:", window.google?.maps);

      if (window.google && window.google.maps && mapElement) {
        console.log("지도 생성 조건 충족, 지도 생성 중...");
        const center = { lat: 37.5665, lng: 126.978 }; // 서울 시청 좌표
        const map = new window.google.maps.Map(mapElement, {
          center,
          zoom: 15,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        new window.google.maps.Marker({
          position: center,
          map: map,
          title: "Greensupia",
        });
        console.log("지도 생성 완료");

        // 플레이스홀더 제거
        const placeholder = mapElement.querySelector(
          ".greensupia-map__placeholder"
        );
        if (placeholder) {
          placeholder.remove();
        }

        // Force map to recalculate its size and center
        setTimeout(() => {
          const googleMaps = window.google?.maps as {
            event?: {
              trigger: (
                map: {
                  setZoom: (zoom: number) => void;
                  setCenter: (center: { lat: number; lng: number }) => void;
                },
                event: string
              ) => void;
            };
          };
          if (googleMaps?.event) {
            googleMaps.event.trigger(map, "resize");
            map.setCenter(center);
          }
        }, 100);

        // Additional resize trigger after a longer delay
        setTimeout(() => {
          const googleMaps = window.google?.maps as {
            event?: {
              trigger: (
                map: {
                  setZoom: (zoom: number) => void;
                  setCenter: (center: { lat: number; lng: number }) => void;
                },
                event: string
              ) => void;
            };
          };
          if (googleMaps?.event) {
            googleMaps.event.trigger(map, "resize");
            map.setCenter(center);
          }
        }, 500);
      } else {
        console.error("지도 생성 실패:", {
          google: !!window.google,
          maps: !!window.google?.maps,
          mapElement: !!mapElement,
        });
        // 재시도
        setTimeout(() => createMap(mapElement), 500);
      }
    }

    function showMapPlaceholder(mapElement: HTMLElement) {
      console.log("지도 플레이스홀더 표시");
      if (mapElement) {
        mapElement.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-200 rounded-lg">
            <div class="text-center text-gray-600">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <p class="text-lg font-medium">지도 로드 중...</p>
              <p class="text-sm">Google Maps API 키가 필요합니다</p>
            </div>
          </div>
        `;
      }
    }

    // 컴포넌트가 마운트된 후 지도 초기화 시작
    setTimeout(initializeMap, 2000);
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
              const firstVideo = videoData[0];
              console.log("첫 번째 비디오:", firstVideo);
              console.log("비디오 활성 상태:", firstVideo.isActive);
              console.log("비디오 YouTube URL:", firstVideo.videoUrl);
              // 활성 상태인 비디오만 설정
              if (firstVideo.isActive) {
                setVideo(firstVideo);
                console.log("비디오 상태 설정 완료");
              } else {
                console.log("활성 상태인 비디오가 없습니다.");
              }
            } else {
              console.log("비디오 데이터가 비어있습니다.");
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

        // 조직도 데이터 가져오기
        try {
          const organizationResponse = await fetch(
            "/api/organization?action=active"
          );
          if (organizationResponse.ok) {
            const organizationData = await organizationResponse.json();
            console.log("조직도 데이터:", organizationData);
            // 조직도 데이터는 단일 객체로 반환됨
            if (organizationData && organizationData.isActive) {
              setOrganizationChart(organizationData);
            }
          }
        } catch (organizationError) {
          console.log("조직도 데이터를 불러올 수 없습니다:", organizationError);
        }

        // 히스토리 데이터 가져오기
        try {
          const historyResponse = await fetch("/api/history?action=active");
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            console.log("히스토리 데이터:", historyData);
            // 히스토리 데이터는 {data: Array} 형태로 반환됨
            if (
              historyData &&
              historyData.data &&
              Array.isArray(historyData.data)
            ) {
              setHistories(historyData.data);
            }
          }
        } catch (historyError) {
          console.log("히스토리 데이터를 불러올 수 없습니다:", historyError);
          setHistories([]);
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
                href="/greensupia/notice"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                공지사항
              </Link>
              <Link
                href="/greensupia/consultation"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                1:1 상담게시판
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
          <section className="mb-12 text-center">
            <div
              className="greensupia-banner"
              style={{
                backgroundImage: `url(${banner.imageUrl})`,
              }}
            >
              <div className="greensupia-banner__overlay"></div>
              <div className="greensupia-banner__content">
                <h2>{banner.title}</h2>
                <p>
                  What is Lorem Ipsum? <br />
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. <br />
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s, <br />
                  when an unknown printer took a galley of type and scrambled it
                  to make a type specimen book.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 기본 히어로 섹션 (배너가 없을 때) */}
        {!banner && (
          <section className="mb-12 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20 rounded-lg relative overflow-hidden text-center">
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
              className="max-w-4xl mx-auto prose prose-lg text-center"
              dangerouslySetInnerHTML={{ __html: greeting.content }}
            />
          </section>
        )}

        {/* 배너뉴스 섹션 */}
        {bannerNews && bannerNews.length > 0 && (
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              최신 소식
            </h2>
            <div className="greensupia-news__grid">
              {bannerNews.slice(0, 4).map((news) => (
                <article key={news.id} className="greensupia-news__item">
                  {news.imageUrl && (
                    <div className="greensupia-news__image-container">
                      <Image
                        src={news.imageUrl}
                        alt={news.title}
                        width={400}
                        height={192}
                        className="greensupia-news__image"
                        priority={true}
                        style={{ height: "auto" }}
                      />
                    </div>
                  )}
                  <div className="greensupia-news__content">
                    <h3 className="greensupia-news__title">{news.title}</h3>
                    <p className="greensupia-news__description">
                      {news.content}
                    </p>
                    <div className="greensupia-news__meta">
                      <span className="greensupia-news__date">
                        {news.startDate
                          ? new Date(news.startDate).toLocaleDateString("ko-KR")
                          : "날짜 없음"}
                      </span>
                      {news.linkUrl && (
                        <a
                          href={news.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="greensupia-news__link"
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

        {/* 비디오 섹션 */}
        {video && video.isActive && (
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              회사 소개 영상
            </h2>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-gray-600 mb-6 text-center">
                  {video.description}
                </p>
              )}
              <div className="greensupia-video__container">
                <div className="greensupia-video__iframe-wrapper">
                  <div
                    className="greensupia-video__iframe"
                    dangerouslySetInnerHTML={{ __html: video.videoUrl }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 조직도 섹션 */}
        {organizationChart && organizationChart.isActive && (
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              조직도
            </h2>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="greensupia-organization__container">
                {organizationChart.imageUrl ? (
                  <img
                    src={organizationChart.imageUrl}
                    alt="조직도"
                    className="greensupia-organization__image"
                    onError={(e) => {
                      console.error(
                        "조직도 이미지 로드 실패:",
                        organizationChart.imageUrl
                      );
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="greensupia-organization__placeholder">
                    조직도 이미지를 불러올 수 없습니다.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 히스토리 섹션 */}
        {histories.length > 0 && (
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              회사 연혁
            </h2>
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="greensupia-history__timeline">
                  {Object.entries(
                    histories.reduce((acc, history) => {
                      if (!acc[history.year]) {
                        acc[history.year] = [];
                      }
                      acc[history.year].push(history);
                      return acc;
                    }, {} as Record<string, History[]>)
                  )
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([year, yearHistories]) => (
                      <div
                        key={year}
                        className="greensupia-history__year-group"
                      >
                        <h3 className="greensupia-history__year-title">
                          {year}
                        </h3>
                        <div className="greensupia-history__year-content">
                          {yearHistories
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((history) => (
                              <div
                                key={history.id}
                                className="greensupia-history__item"
                              >
                                <p className="greensupia-history__description">
                                  {history.description}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 오시는길 섹션 */}
        <section className="greensupia-contact">
          <h2 className="greensupia-contact__title">오시는 길</h2>
          <div className="greensupia-contact__container">
            <div className="greensupia-contact__content">
              {/* 주소 정보 카드 */}
              <div className="greensupia-contact__info">
                <div className="greensupia-contact__card">
                  <h3 className="greensupia-contact__company">Greensupia</h3>
                  <div className="greensupia-contact__details">
                    <div className="greensupia-contact__item">
                      <strong>도로명</strong>
                      <p>서울특별시 강남구 테헤란로 123</p>
                    </div>
                    <div className="greensupia-contact__item">
                      <strong>지번</strong>
                      <p>서울특별시 강남구 역삼동 123-45</p>
                    </div>
                    <div className="greensupia-contact__item">
                      <strong>우편번호</strong>
                      <p>06123</p>
                    </div>
                    <div className="greensupia-contact__item">
                      <strong>전화</strong>
                      <p>02-1234-5678</p>
                    </div>
                    <div className="greensupia-contact__item">
                      <strong>이메일</strong>
                      <p>info@greensupia.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 지도 카드 */}
              <div className="greensupia-contact__map">
                <div className="greensupia-contact__card">
                  <h3 className="greensupia-contact__location">위치</h3>
                  <div className="greensupia-map__container">
                    <div id="map" className="greensupia-map__element">
                      <div className="greensupia-map__placeholder">
                        <div className="placeholder-content">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="placeholder-title">지도 로드 중...</p>
                          <p className="placeholder-subtitle">
                            잠시만 기다려주세요
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Greensupia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
