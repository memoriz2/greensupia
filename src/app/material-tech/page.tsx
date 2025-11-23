"use client";

import Image from "next/image";

export default function MaterialTechPage() {
  return (
    <div className="greensupia-page">
      {/* 탑배너 */}
      <section className="greensupia-page__banner greensupia-page__banner--full">
        <Image
          src="/method-tech_tbanner.jpg"
          alt="소재·기술"
          width={1905}
          height={400}
          priority
          className="greensupia-page__banner-image"
          style={{ height: 'auto' }}
        />
      </section>

      <main className="greensupia-page__content">
        {/* 기술 이미지 섹션 - 오버레이 */}
        <section className="greensupia-page__section greensupia-page__section--overlay">
          <div className="greensupia-page__overlay-container">
            <Image
              src="/tech2.png"
              alt="기술"
              width={1905}
              height={800}
              className="greensupia-page__image greensupia-page__image--base"
            />
            <p className="greensupia-page__overlay-content"><strong>왜 생분해인가</strong>(문제/대안/LCA 개요)</p>
            <div>
            <Image
              src="/method-tech01.jpg"
              alt="핵심 소재"
              width={1905}
              height={800}
              className="greensupia-page__image greensupia-page__image--overlay"
            />
            <div className="greensupia-page__overlay-text">
              <div className="greensupia-page__overlay-block">
                <h3>&apos;생분해&apos;</h3>
                <p>아무 데서나 사라짐이 아닙니다. 표준이 정하는 조건(온도·산소·수분·시간) 하에서 검증된 속도와 안전성으로 분해됨을 뜻합니다.</p>
                <p className="greensupia-page__overlay-sub">· 생분해 현수막 및 배너, 생분해 멀칭필름은 55°C 이상 온도조건에서 6개월 내 90% 이상 분해가 됩니다.</p>
              </div>
              <div className="greensupia-page__overlay-block">
                <h3>왜 &quot;제주형 순환&quot;과 잘 맞나요?</h3>
                <p className="greensupia-page__overlay-sub">· 회수-처리-성과보고까지 한 흐름으로 묶여 행사 종료 후 폐기 부담을 줄이고, 
                  <br/>&nbsp;&nbsp;회수율·CO₂절감 등 측정 가능한 성과로 전환할 수 있습니다.</p>
                <p className="greensupia-page__overlay-sub">· 정책·조례 정합성이 요구되는 공공영역에서 표준(EN/ASTM/ISO) 기반 문서화가 용이합니다.</p>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="greensupia-page__section">
          <div className="greensupia-page__section-header">
            <Image
              src="/tech_faq.png"
              alt="자주 묻는 질문"
              width={300}
              height={75}
              className="greensupia-page__section-header-image"
              style={{ maxWidth: '250px', height: 'auto', margin: '0 auto', display: 'block' }}
            />
          </div>
          <div className="greensupia-faq">
            <div className="greensupia-faq__grid">
              <div className="greensupia-faq__item">
                <div className="greensupia-faq__icon">
                  <Image src="/method-tech02.jpg" alt="" width={60} height={60} />
                </div>
                <div className="greensupia-faq__content">
                  <h3 className="greensupia-faq__question">&apos;생분해&apos;와 &apos;퇴비화 가능&apos;은 같은가요?</h3>
                  <p className="greensupia-faq__answer">
                    다릅니다. 퇴비화 가능(Compostable)은 표준이 정한 산업용 컴포스트 조건에서 분해·생분해·유해성 기준을 통과했음을 뜻합니다. 가정용/해양 분해는 포함되지 않습니다.
                  </p>
                </div>
              </div>

              <div className="greensupia-faq__item">
                <div className="greensupia-faq__icon">
                  <Image src="/method-tech02.jpg" alt="" width={60} height={60} />
                </div>
                <div className="greensupia-faq__content">
                  <h3 className="greensupia-faq__question">인증/시험 자료는 어디서 보나요?</h3>
                  <p className="greensupia-faq__answer">
                    홈페이지 소재·기술 카테고리 안에서 볼 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="greensupia-faq__item">
                <div className="greensupia-faq__icon">
                  <Image src="/method-tech02.jpg" alt="" width={60} height={60} />
                </div>
                <div className="greensupia-faq__content">
                  <h3 className="greensupia-faq__question">인쇄는 어떻게 하나요?</h3>
                  <p className="greensupia-faq__answer">
                    대형 실사/디지털 인쇄 권장. 수성/UV 잉크 가이드, 색관리(프로파일)와 후가공(펀칭/재단/난연 옵션) 안내를 제공합니다.
                  </p>
                </div>
              </div>

              <div className="greensupia-faq__item">
                <div className="greensupia-faq__icon">
                  <Image src="/method-tech02.jpg" alt="" width={60} height={60} />
                </div>
                <div className="greensupia-faq__content">
                  <h3 className="greensupia-faq__question">중금속/독성은 괜찮나요?</h3>
                  <p className="greensupia-faq__answer">
                    그린수피아 모든 제품은 KTR 8대금속 검증을 받은 제품이어서 안심해도 됩니다.
                  </p>
                </div>
              </div>

              <div className="greensupia-faq__item">
                <div className="greensupia-faq__icon">
                  <Image src="/method-tech02.jpg" alt="" width={60} height={60} />
                </div>
                <div className="greensupia-faq__content">
                  <h3 className="greensupia-faq__question">보관은 어떻게 하나요?</h3>
                  <p className="greensupia-faq__answer">
                    직사광선/고온다습 회피, 원포장 상태 보관 권장. 유통기한/제조일자 표기.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
