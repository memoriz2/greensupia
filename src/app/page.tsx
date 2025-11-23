"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannerNews } from "@/types/bannerNews";

import { OrganizationStructuredData } from "@/components/StructuredData";

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
  description?: string;
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
  const [bannerNews, setBannerNews] = useState<bannerNews[] | null>(null);
  const [organizationChart, setOrganizationChart] = useState<OrganizationChart | null>(null);
  const [histories, setHistories] = useState<History[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // YouTube URL에서 비디오 ID 추출 함수
  const extractVideoId = (videoUrl: string): string | null => {
    try {
      // iframe 코드에서 src 추출
      const srcMatch = videoUrl.match(/src="([^"]+)"/);
      if (srcMatch) {
        const src = srcMatch[1];
        // YouTube URL에서 비디오 ID 추출
        const videoIdMatch = src.match(
          /(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/
        );
        return videoIdMatch ? videoIdMatch[1] : null;
      }
      return null;
    } catch (error) {
      console.error("비디오 ID 추출 실패:", error);
      return null;
    }
  };

  // YouTube 직접 링크 생성 함수
  const getYouTubeDirectLink = (videoUrl: string): string => {
    const videoId = extractVideoId(videoUrl);
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#";
  };

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
          // 여러 활성 배너 가져오기
          const bannersResponse = await fetch("/api/banners?action=active");
          if (bannersResponse.ok) {
            const bannersData = await bannersResponse.json();
            setBanners(bannersData);
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

  // 배너 데이터 디버깅
  useEffect(() => {
    if (banners.length > 0) {
      console.log('배너 데이터:', banners);
      banners.forEach((banner, index) => {
        const imageUrl = banner.imageUrl?.trim() || '/main_06.jpg';
        console.log(`배너 ${index + 1}:`, {
          id: banner.id,
          title: banner.title,
          imageUrl: banner.imageUrl,
          '사용될 URL': imageUrl
        });
      });
    }
  }, [banners]);

  // 자동 슬라이드 전환 (5초마다)
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        (prevIndex + 1) % banners.length
      );
    }, 5000); // 5초

    return () => clearInterval(interval);
  }, [banners.length]);

  // 수동 네비게이션
  const goToNext = () => {
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex + 1) % banners.length
    );
  };

  const goToPrevious = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentBannerIndex(index);
  };

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
    <div className="greensupia-home">
      <OrganizationStructuredData
        data={{
          name: "Greensupia",
          url: "https://www.greensupia.com",
          description:
            "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
          logo: "https://www.greensupia.com/logo.png",
          address: {
            streetAddress: "테헤란로 123",
            addressLocality: "강남구",
            addressRegion: "서울특별시",
            postalCode: "06123",
            addressCountry: "KR",
          },
          contactPoint: {
            telephone: "+82-2-1234-5678",
            contactType: "customer service",
          },
        }}
      />

      {/* 슬라이드 배너 섹션 */}
      <section className="greensupia-banner-slider">
        <div className="banner-slider-container">
          {/* 배너 슬라이드 */}
          <div className="banner-slides">
            {banners && banners.length > 0 ? (
              banners.map((banner, index) => {
                const imageUrl = banner.imageUrl?.trim() || '/main_06.jpg';
                return (
                  <div
                    key={banner.id}
                    className={`banner-slide ${index === currentBannerIndex ? 'active' : ''}`}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                    }}
                  >
                    <div className="banner-slide__overlay"></div>
                    <div className="banner-slide__content">
                      {banner.description && (
                        <div
                          className="banner-description"
                          dangerouslySetInnerHTML={{ __html: banner.description }}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              // 배너 데이터가 없을 때 fallback 이미지 표시
              <div
                className="banner-slide active"
                style={{
                  backgroundImage: 'url(/main_06.jpg)',
                }}
              >
                <div className="banner-slide__overlay"></div>
              </div>
            )}
          </div>

            {/* 인디케이터 */}
            {banners && banners.length > 1 && (
              <div className="banner-indicators">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`banner-indicator ${index === currentBannerIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`${index + 1}번째 배너로 이동`}
                  />
                ))}
              </div>
            )}

            {/* 진행 바 */}
            {banners && banners.length > 1 && (
              <div className="banner-progress">
                <div
                  className="banner-progress-bar"
                  style={{
                    width: `${((currentBannerIndex + 1) / banners.length) * 100}%`
                  }}
                />
              </div>
            )}
          </div>
        </section>

      <main className="greensupia-home__container">
        {/* 기본 히어로 섹션 (배너가 없을 때) */}
        {!banner && (
          <section className="mb-12 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20 rounded-lg relative overflow-hidden text-center">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>
          </section>
        )}

        {/* 배너뉴스 섹션 */}
        <section className="greensupia-news greensupia-section">
          <Image
            src="/title_blit.jpg"
            alt=""
            width={22}
            height={21}
            className="greensupia-contact__title-icon"
          />
          <h2 className="greensupia-contact__title">그린수피아</h2>
          <div className="greensupia-news__grid">
            {bannerNews && bannerNews.length > 0 ? (
              bannerNews.slice(0, 4).map((news) => (
                <article key={news.id} className="greensupia-news__item">
                  {news.imageUrl && (
                    <div className="greensupia-news__image-container">
                      <Image
                        src={news.imageUrl}
                        alt={news.title}
                        fill
                        className="greensupia-news__image"
                        priority={true}
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  )}
                </article>
              ))
            ) : (
              <>
                {[
                  "/main_09.jpg",
                  "/main_11.jpg",
                  "/main_13.jpg",
                  "/main_15.jpg",
                ].map((imageSrc, index) => (
                  <article key={index} className="greensupia-news__item">
                    <div className="greensupia-news__image-container">
                      <Image
                        src={imageSrc}
                        alt={`그린수피아 ${index + 1}`}
                        fill
                        className="greensupia-news__image"
                        priority={true}
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  </article>
                ))}
              </>
            )}
          </div>
        </section>

        {/* 인사말 섹션 */}
        {greeting && (
          <section className="greensupia-greeting">
            <h2 className="greensupia-greeting__title">{greeting.title}</h2>
            <div className="greensupia-greeting__container">
              <div
                className="greensupia-greeting__content"
                dangerouslySetInnerHTML={{ __html: greeting.content }}
              />
            </div>
          </section>
        )}


        {/* 미션&비전 섹션 */}
        <section className="greensupia-organization">
          <Image src="/main_21.jpg" alt="미션비전" width={1905} height={557}
            className="greensupia-organization__image" />
        </section>


        {/* CI/BI 섹션 */}
        <section className="greensupia-ci-bi greensupia-section">
        <Image
            src="/title_blit.jpg"
            alt=""
            width={22}
            height={21}
            className="greensupia-contact__title-icon"
          />
          <h2 className="greensupia-contact__title">그린수피아 CI / BI</h2>
          <Image src="/main_28.jpg" alt="CI/BI" width={1905} height={557} 
           className="greensupia-ci-bi__image" />
           <div className="greensupia-ci-bi__content">
            <div className="greensupia-ci-bi__content-item">
              <Image src="/ci.jpg" alt="CI" width={1905} height={557} />
              <p>그린수피아의 로고는 <strong>&apos;지속 가능한 미래를 향한 순환과 혁신&apos;</strong>을 상징합니다.
              <br/>로고의 화살표 형태는 친환경 순환을, 디지털 픽셀은 기술 혁신을 의미하며, 녹색 톤은 <strong>자연과 조화</strong>를 이루는 기업 철학을 담고 있습니다.
              <br/>그린수피아는 깨끗한 삶의 환경을 위한 솔루션을 제공하는 <strong>지속가능 경영의 파트너</strong>입니다.
              </p>
            </div>
            <div className="greensupia-ci-bi__content-item">
              <Image src="/bi.jpg" alt="BI" width={1905} height={557} />
              <p>그린수피아 브랜드는 <strong>&apos;Green + Utopia&apos;</strong>의 결합으로, 인간과 환경이 공존하는 이상적인 세상을 지향합니다.
              <br/>모든 제품과 서비스에는 친환경 가치와 첨단 기술이 결합되어 있으며, &apos;작은 변화로 큰 미래를 만든다&apos;는 슬로건 아래 지속가능한 혁신을 실천합니다.
              </p>
            </div>
           </div>
        </section>

        {/* 히스토리 섹션 */}
        <section className="greensupia-history">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Image
              src="/title_blit.jpg"
              alt=""
              width={22}
              height={21}
              className="greensupia-contact__title-icon"
            />
            <h2 className="greensupia-contact__title">회사 연혁</h2>
          </div>
          <Image src="/main_31.jpg" alt="히스토리" width={1905} height={557} />
        </section>
      </main>
    </div>
  );
}
