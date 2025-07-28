"use client";

import Link from "next/link";

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "기업 웹사이트 리뉴얼",
      client: "ABC 기업",
      description:
        "기존 웹사이트를 현대적인 디자인으로 리뉴얼하고, 사용자 경험을 개선했습니다. 반응형 디자인과 SEO 최적화를 통해 방문자 수가 40% 증가했습니다.",
      category: "웹사이트 개발",
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      image: "/api/placeholder/400/300",
      year: "2024",
      duration: "6주",
      features: ["반응형 디자인", "SEO 최적화", "관리자 페이지", "성능 최적화"],
    },
    {
      id: 2,
      title: "온라인 쇼핑몰 구축",
      client: "XYZ 쇼핑",
      description:
        "완전한 온라인 쇼핑몰 시스템을 구축했습니다. 상품 관리, 결제 시스템, 재고 관리 등 모든 기능을 포함한 종합적인 솔루션을 제공했습니다.",
      category: "쇼핑몰 개발",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      image: "/api/placeholder/400/300",
      year: "2024",
      duration: "10주",
      features: ["상품 관리", "결제 시스템", "재고 관리", "회원 관리"],
    },
    {
      id: 3,
      title: "웹 애플리케이션 개발",
      client: "Tech Startup",
      description:
        "실시간 데이터 처리와 사용자 상호작용이 가능한 고성능 웹 애플리케이션을 개발했습니다. 복잡한 비즈니스 로직을 효율적으로 처리합니다.",
      category: "웹 애플리케이션",
      technologies: ["React", "TypeScript", "Node.js", "Socket.io"],
      image: "/api/placeholder/400/300",
      year: "2023",
      duration: "12주",
      features: ["실시간 처리", "사용자 상호작용", "데이터 시각화", "API 연동"],
    },
    {
      id: 4,
      title: "모바일 최적화 웹사이트",
      client: "Mobile First Co.",
      description:
        "모바일 사용자를 우선으로 하는 웹사이트를 개발했습니다. 터치 인터페이스와 빠른 로딩 속도로 모바일 사용자 경험을 극대화했습니다.",
      category: "모바일 웹",
      technologies: ["Next.js", "PWA", "Service Workers", "CSS Grid"],
      image: "/api/placeholder/400/300",
      year: "2023",
      duration: "8주",
      features: ["PWA 지원", "오프라인 기능", "터치 최적화", "빠른 로딩"],
    },
    {
      id: 5,
      title: "관리자 대시보드",
      client: "Admin Solutions",
      description:
        "복잡한 데이터를 효율적으로 관리할 수 있는 관리자 대시보드를 개발했습니다. 실시간 차트와 리포트 기능을 통해 비즈니스 인사이트를 제공합니다.",
      category: "대시보드",
      technologies: ["React", "Chart.js", "Node.js", "MySQL"],
      image: "/api/placeholder/400/300",
      year: "2023",
      duration: "6주",
      features: ["실시간 차트", "데이터 필터링", "엑셀 내보내기", "권한 관리"],
    },
    {
      id: 6,
      title: "API 개발 및 연동",
      client: "API Hub",
      description:
        "다양한 서비스와 연동할 수 있는 RESTful API를 개발했습니다. 보안과 성능을 고려한 설계로 안정적인 서비스를 제공합니다.",
      category: "API 개발",
      technologies: ["Node.js", "Express", "JWT", "Redis"],
      image: "/api/placeholder/400/300",
      year: "2023",
      duration: "4주",
      features: ["RESTful API", "JWT 인증", "캐싱", "문서화"],
    },
  ];

  const categories = [
    "전체",
    "웹사이트 개발",
    "쇼핑몰 개발",
    "웹 애플리케이션",
    "모바일 웹",
    "대시보드",
    "API 개발",
  ];

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/greensupia"
                className="text-2xl font-bold text-green-600"
              >
                Greensupia
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/greensupia"
                className="text-gray-600 hover:text-green-600 transition-colors"
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
                className="text-gray-900 hover:text-green-600 transition-colors"
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
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              완료된 프로젝트
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              다양한 산업 분야의 고객들과 함께 성공적인 프로젝트를 완료했습니다.
              각 프로젝트는 최신 기술과 창의적인 솔루션으로 구현되었습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 프로젝트 필터 */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 프로젝트 그리드 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <article
                key={project.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/80 rounded-lg flex items-center justify-center mx-auto mb-2">
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
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {project.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {project.year}
                    </span>
                  </div>

                  <p className="text-sm text-green-600 font-medium mb-2">
                    {project.client}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      주요 기능
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {project.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {project.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{project.features.length - 3}개 더
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      사용 기술
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      개발 기간: {project.duration}
                    </span>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                      자세히 보기 →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              프로젝트 통계
            </h2>
            <p className="text-lg text-gray-600">
              지금까지 성공적으로 완료한 프로젝트들의 성과입니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "50+", label: "완료 프로젝트" },
              { number: "30+", label: "만족한 고객" },
              { number: "95%", label: "고객 만족도" },
              { number: "24/7", label: "기술 지원" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 고객 후기 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">고객 후기</h2>
            <p className="text-lg text-gray-600">
              프로젝트를 함께한 고객들의 생생한 후기를 확인하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "김철수",
                company: "ABC 기업 CEO",
                content:
                  "Greensupia와 함께한 웹사이트 리뉴얼 프로젝트가 매우 만족스러웠습니다. 전문적인 기술력과 소통 능력으로 예상보다 빠르게 완료되었고, 결과물도 훌륭합니다.",
                rating: 5,
              },
              {
                name: "이영희",
                company: "XYZ 쇼핑 대표",
                content:
                  "온라인 쇼핑몰 구축 프로젝트에서 Greensupia의 전문성을 확인했습니다. 복잡한 요구사항도 정확히 이해하고 구현해주셔서 감사합니다.",
                rating: 5,
              },
              {
                name: "박민수",
                company: "Tech Startup CTO",
                content:
                  "웹 애플리케이션 개발에서 최신 기술을 활용한 솔루션을 제공해주셨습니다. 성능과 확장성 모두 만족스러운 결과물입니다.",
                rating: 5,
              },
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.content}</p>
                <div>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            다음 성공 사례의 주인공이 되어보세요
          </h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Greensupia와 함께 귀사의 비즈니스를 디지털로 성장시켜보세요.
          </p>
          <Link
            href="/greensupia/contact"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            프로젝트 문의하기
          </Link>
        </div>
      </section>

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
                    문의
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">연락처</h5>
              <div className="space-y-2 text-gray-400">
                <p>이메일: contact@greensupia.com</p>
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
