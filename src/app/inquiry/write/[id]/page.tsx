"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function InquiryEditPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    email: "",
    isSecret: false,
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 기존 데이터 로드
  useEffect(() => {
    const loadInquiry = async () => {
      try {
        const response = await fetch(`/api/inquiries/${inquiryId}`);
        if (response.ok) {
          const data = await response.json();
          const inquiry = data.data;

          setFormData({
            title: inquiry.title,
            content: inquiry.content,
            author: inquiry.author,
            email: "", // 이메일은 복호화되지 않으므로 빈 값
            isSecret: inquiry.isSecret,
            password: "", // 비밀번호는 보안상 빈 값
          });
        } else {
          console.error("문의글을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("문의글 로드 중 오류가 발생했습니다:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (inquiryId) {
      loadInquiry();
    }
  }, [inquiryId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/greensupia/inquiry/${inquiryId}`);
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (err) {
      console.error("문의글 수정 중 오류:", err);
      alert("문의글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="inquiry-edit">
        <section className="inquiry-edit__loading">
          <h1>문의글 수정</h1>
          <p>문의글을 불러오는 중입니다...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="inquiry-edit">
      <header className="inquiry-edit__header">
        <h1>문의글 수정</h1>
        <p>
          문의글 내용을 수정할 수 있습니다. 이메일과 비밀번호는 보안상 변경할 수
          없습니다.
        </p>
      </header>

      <section className="inquiry-edit__form-section">
        <form onSubmit={handleSubmit} className="inquiry-edit__form">
          <fieldset className="inquiry-edit__fieldset">
            <legend className="inquiry-edit__legend">기본 정보</legend>

            <div className="inquiry-edit__field">
              <label htmlFor="title" className="inquiry-edit__label">
                제목 <span className="inquiry-edit__required">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="inquiry-edit__input"
                placeholder="문의글 제목을 입력하세요"
                maxLength={100}
              />
            </div>

            <div className="inquiry-edit__field">
              <label htmlFor="author" className="inquiry-edit__label">
                작성자 <span className="inquiry-edit__required">*</span>
              </label>
              <input
                id="author"
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
                className="inquiry-edit__input"
                placeholder="작성자 이름을 입력하세요"
                maxLength={50}
              />
            </div>

            <div className="inquiry-edit__field">
              <label htmlFor="email" className="inquiry-edit__label">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="inquiry-edit__input"
                placeholder="답변 알림을 받을 이메일을 입력하세요"
                maxLength={100}
              />
              <small className="inquiry-edit__help">
                답변이 완료되면 이메일로 알림을 받을 수 있습니다.
              </small>
            </div>
          </fieldset>

          <fieldset className="inquiry-edit__fieldset">
            <legend className="inquiry-edit__legend">보안 설정</legend>

            <div className="inquiry-edit__field">
              <label className="inquiry-edit__checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isSecret}
                  onChange={(e) =>
                    setFormData({ ...formData, isSecret: e.target.checked })
                  }
                  className="inquiry-edit__checkbox"
                />
                <span className="inquiry-edit__checkbox-text">
                  비밀글로 설정
                </span>
              </label>
              <small className="inquiry-edit__help">
                비밀글로 설정하면 비밀번호를 입력해야만 내용을 볼 수 있습니다.
              </small>
            </div>

            {formData.isSecret && (
              <div className="inquiry-edit__field">
                <label htmlFor="password" className="inquiry-edit__label">
                  비밀번호 <span className="inquiry-edit__required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={formData.isSecret}
                  className="inquiry-edit__input"
                  placeholder="비밀글 접근용 비밀번호를 입력하세요"
                  minLength={4}
                  maxLength={20}
                />
                <small className="inquiry-edit__help">
                  4~20자리의 비밀번호를 입력하세요. (변경하지 않으려면
                  비워두세요)
                </small>
              </div>
            )}
          </fieldset>

          <fieldset className="inquiry-edit__fieldset">
            <legend className="inquiry-edit__legend">문의 내용</legend>

            <div className="inquiry-edit__field">
              <label htmlFor="content" className="inquiry-edit__label">
                내용 <span className="inquiry-edit__required">*</span>
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                className="inquiry-edit__textarea"
                placeholder="문의사항을 자세히 작성해주세요"
                rows={10}
                maxLength={2000}
              />
              <small className="inquiry-edit__help">
                최대 2,000자까지 입력 가능합니다.
              </small>
            </div>
          </fieldset>

          <div className="inquiry-edit__actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="inquiry-edit__button inquiry-edit__button--secondary"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inquiry-edit__button inquiry-edit__button--primary"
            >
              {isLoading ? "수정 중..." : "수정하기"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
