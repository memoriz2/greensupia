"use client";

import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "기업 웹사이트 개발",
      description:
        "브랜드 아이덴티티를 반영한 전문적인 기업 웹사이트를 개발합니다.",
      features: [
        "반응형 웹 디자인",
        "SEO 최적화",
        "관리자 페이지",
        "콘텐츠 관리 시스템",
        "모바일 최적화",
        "소셜 미디어 연동",
      ],
      price: "300만원~",
      duration: "4-6주",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "쇼핑몰 개발",
      description: "온라인 비즈니스를 위한 완전한 쇼핑몰 솔루션을 제공합니다.",
      features: [
        "상품 관리 시스템",
        "결제 시스템 연동",
        "재고 관리",
        "주문 관리",
        "회원 관리",
        "리뷰 시스템",
      ],
      price: "500만원~",
      duration: "6-8주",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "웹 애플리케이션 개발",
      description:
        "React, Next.js를 활용한 고성능 웹 애플리케이션을 개발합니다.",
      features: [
        "React/Next.js 개발",
        "TypeScript 적용",
        "상태 관리 최적화",
        "API 연동",
        "실시간 기능",
        "성능 최적화",
      ],
      price: "800만원~",
      duration: "8-12주",
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
    },
    {
      id: 4,
      title: "유지보수 & 호스팅",
      description:
        "개발 완료 후 안정적인 운영을 위한 종합적인 유지보수 서비스입니다.",
      features: [
        "24/7 서버 모니터링",
        "정기 백업",
        "보안 패치",
        "성능 최적화",
        "콘텐츠 업데이트",
        "기술 지원",
      ],
      price: "월 30만원~",
      duration: "연간 계약",
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
    },
  ];

  const technologies = [
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "TypeScript", icon: "📘" },
    { name: "Node.js", icon: "🟢" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "AWS", icon: "☁️" },
    { name: "Docker", icon: "🐳" },
    { name: "Git", icon: "📝" },
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
                className="text-gray-900 hover:text-green-600 transition-colors"
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
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              전문적인 웹 개발 서비스
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              귀사의 비즈니스 요구사항에 맞는 맞춤형 웹 개발 솔루션을
              제공합니다. 최신 기술과 창의적인 디자인으로 디지털 성장을
              이끌어드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* 서비스 카드 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              서비스 종류
            </h2>
            <p className="text-lg text-gray-600">
              비즈니스 규모와 목적에 맞는 최적의 서비스를 선택하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <div className="text-green-600">{service.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-green-600 font-semibold">
                      {service.price}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    포함 기능
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    개발 기간: {service.duration}
                  </span>
                  <Link
                    href="/greensupia/contact"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    견적 문의
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기술 스택 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">사용 기술</h2>
            <p className="text-lg text-gray-600">
              최신 기술 스택으로 안정적이고 확장 가능한 솔루션을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {technologies.map((tech) => (
              <div key={tech.name} className="text-center">
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{tech.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{tech.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 개발 프로세스 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              개발 프로세스
            </h2>
            <p className="text-lg text-gray-600">
              체계적인 프로세스로 프로젝트를 성공적으로 완료합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "요구사항 분석",
                description:
                  "고객의 비즈니스 목표와 요구사항을 정확히 파악합니다.",
              },
              {
                step: "02",
                title: "기획 & 디자인",
                description:
                  "사용자 경험을 중심으로 한 기획과 디자인을 진행합니다.",
              },
              {
                step: "03",
                title: "개발 & 구현",
                description:
                  "최신 기술을 활용하여 안정적이고 확장 가능한 시스템을 구축합니다.",
              },
              {
                step: "04",
                title: "테스트 & 배포",
                description:
                  "철저한 테스트 후 안전하게 배포하고 유지보수를 시작합니다.",
              },
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">
                    {process.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {process.title}
                </h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
