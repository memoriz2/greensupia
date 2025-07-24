"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // 실제 API 호출 대신 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        service: "",
        budget: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                프로젝트
              </Link>
              <Link
                href="/greensupia/contact"
                className="text-gray-900 hover:text-green-600 transition-colors"
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
              프로젝트 문의
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              귀사의 비즈니스에 최적화된 웹 개발 솔루션을 제안해드립니다. 무료
              상담을 통해 프로젝트 계획을 함께 수립해보세요.
            </p>
          </div>
        </div>
      </section>

      {/* 문의 폼 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 문의 폼 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                문의하기
              </h2>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-green-800">
                      문의가 성공적으로 전송되었습니다. 빠른 시일 내에
                      연락드리겠습니다.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-red-800">
                      문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      이름 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="홍길동"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      이메일 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="example@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      회사명
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="회사명을 입력하세요"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      연락처
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      서비스 종류
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">서비스를 선택하세요</option>
                      <option value="website">웹사이트 개발</option>
                      <option value="shopping">쇼핑몰 개발</option>
                      <option value="webapp">웹 애플리케이션</option>
                      <option value="maintenance">유지보수</option>
                      <option value="consulting">컨설팅</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      예산 범위
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">예산을 선택하세요</option>
                      <option value="under-500">500만원 미만</option>
                      <option value="500-1000">500만원 - 1,000만원</option>
                      <option value="1000-2000">1,000만원 - 2,000만원</option>
                      <option value="over-2000">2,000만원 이상</option>
                      <option value="discuss">상담 후 결정</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    프로젝트 요구사항 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="프로젝트에 대한 구체적인 요구사항을 설명해주세요..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "전송 중..." : "문의하기"}
                </button>
              </form>
            </div>

            {/* 연락처 정보 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                연락처 정보
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    주소
                  </h3>
                  <p className="text-gray-600">
                    서울특별시 강남구 테헤란로 123
                    <br />
                    그린빌딩 5층 501호
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    연락처
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">전화:</span> 02-1234-5678
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">이메일:</span>{" "}
                      contact@greensupia.com
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">팩스:</span> 02-1234-5679
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    업무 시간
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">평일:</span> 09:00 - 18:00
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">토요일:</span> 09:00 - 13:00
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">일요일:</span> 휴무
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    빠른 연락
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="tel:02-1234-5678"
                      className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      02-1234-5678
                    </a>
                    <a
                      href="mailto:contact@greensupia.com"
                      className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      contact@greensupia.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-lg text-gray-600">
              고객들이 자주 묻는 질문들에 대한 답변입니다
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "프로젝트 기간은 얼마나 걸리나요?",
                answer:
                  "프로젝트의 규모와 복잡도에 따라 다르지만, 일반적으로 웹사이트 개발은 4-8주, 웹 애플리케이션은 8-16주 정도 소요됩니다. 정확한 일정은 상담 후 결정됩니다.",
              },
              {
                question: "견적은 어떻게 산출되나요?",
                answer:
                  "프로젝트의 요구사항, 기능의 복잡도, 개발 기간 등을 종합적으로 고려하여 견적을 산출합니다. 무료 상담을 통해 정확한 견적을 제공해드립니다.",
              },
              {
                question: "개발 완료 후 유지보수는 어떻게 하나요?",
                answer:
                  "개발 완료 후 1년간 무료 유지보수를 제공하며, 이후에는 월 유지보수 서비스를 통해 안정적인 운영을 지원합니다.",
              },
              {
                question: "소스코드와 기술 문서는 제공되나요?",
                answer:
                  "네, 프로젝트 완료 시 모든 소스코드와 기술 문서를 제공합니다. 향후 유지보수나 기능 추가를 위해 필요한 모든 자료를 포함합니다.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            지금 바로 문의해보세요
          </h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            전문적인 상담을 통해 귀사의 비즈니스에 최적화된 솔루션을
            제안해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:02-1234-5678"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              전화 문의
            </a>
            <a
              href="mailto:contact@greensupia.com"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              이메일 문의
            </a>
          </div>
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
