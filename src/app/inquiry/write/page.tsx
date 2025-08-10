"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InquiryWritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    email: "",
    isSecret: false,
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/greensupia/inquiry");
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (err) {
      console.error("문의글 등록 중 오류:", err);
      alert("문의글 등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inquiry-write">
      <header className="inquiry-write__header">
        <h1>문의글 작성</h1>
        <p>
          문의사항을 작성해주세요. 비밀글로 설정하면 비밀번호로만 접근할 수
          있습니다.
        </p>
      </header>

      <section className="inquiry-write__form-section">
        <form onSubmit={handleSubmit} className="inquiry-write__form">
          <fieldset className="inquiry-write__fieldset">
            <legend className="inquiry-write__legend">기본 정보</legend>

            <div className="inquiry-write__field">
              <label htmlFor="title" className="inquiry-write__label">
                제목 <span className="inquiry-write__required">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="inquiry-write__input"
                placeholder="문의글 제목을 입력하세요"
                maxLength={100}
              />
            </div>

            <div className="inquiry-write__field">
              <label htmlFor="author" className="inquiry-write__label">
                작성자 <span className="inquiry-write__required">*</span>
              </label>
              <input
                id="author"
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
                className="inquiry-write__input"
                placeholder="작성자 이름을 입력하세요"
                maxLength={50}
              />
            </div>

            <div className="inquiry-write__field">
              <label htmlFor="email" className="inquiry-write__label">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="inquiry-write__input"
                placeholder="답변 알림을 받을 이메일을 입력하세요"
                maxLength={100}
              />
              <small className="inquiry-write__help">
                답변이 완료되면 이메일로 알림을 받을 수 있습니다.
              </small>
            </div>
          </fieldset>

          <fieldset className="inquiry-write__fieldset">
            <legend className="inquiry-write__legend">보안 설정</legend>

            <div className="inquiry-write__field">
              <label className="inquiry-write__checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isSecret}
                  onChange={(e) =>
                    setFormData({ ...formData, isSecret: e.target.checked })
                  }
                  className="inquiry-write__checkbox"
                />
                <span className="inquiry-write__checkbox-text">
                  비밀글로 설정
                </span>
              </label>
              <small className="inquiry-write__help">
                비밀글로 설정하면 비밀번호를 입력해야만 내용을 볼 수 있습니다.
              </small>
            </div>

            {formData.isSecret && (
              <div className="inquiry-write__field">
                <label htmlFor="password" className="inquiry-write__label">
                  비밀번호 <span className="inquiry-write__required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={formData.isSecret}
                  className="inquiry-write__input"
                  placeholder="비밀글 접근용 비밀번호를 입력하세요"
                  minLength={4}
                  maxLength={20}
                />
                <small className="inquiry-write__help">
                  4~20자리의 비밀번호를 입력하세요.
                </small>
              </div>
            )}
          </fieldset>

          <fieldset className="inquiry-write__fieldset">
            <legend className="inquiry-write__legend">문의 내용</legend>

            <div className="inquiry-write__field">
              <label htmlFor="content" className="inquiry-write__label">
                내용 <span className="inquiry-write__required">*</span>
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                className="inquiry-write__textarea"
                placeholder="문의사항을 자세히 작성해주세요"
                rows={10}
                maxLength={2000}
              />
              <small className="inquiry-write__help">
                최대 2,000자까지 입력 가능합니다.
              </small>
            </div>
          </fieldset>

          <div className="inquiry-write__actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="inquiry-write__button inquiry-write__button--secondary"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inquiry-write__button inquiry-write__button--primary"
            >
              {isLoading ? "등록 중..." : "등록하기"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
