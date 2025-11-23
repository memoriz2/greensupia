"use client";

import Image from "next/image";

export default function ProductsPage() {
  return (
    <div className="greensupia-page">
      {/* 탑배너 */}
      <section className="greensupia-page__banner greensupia-page__banner--full">
        <Image
          src="/product_banner.png"
          alt="제품"
          width={1905}
          height={400}
          priority
          className="greensupia-page__banner-image"
          style={{ height: 'auto' }}
        />
      </section>

      <main className="greensupia-page__content">
        {/* 제품 섹션 */}
        <section className="greensupia-page__section">
          <Image
            src="/product_info.png"
            alt="제품 정보"
            width={1905}
            height={400}
            priority
            className="greensupia-products__info-image"
          />
        </section>

          <div className="greensupia-products">
            <div className="greensupia-products__layout">
              {/* 왼쪽 큰 이미지 */}
              <div className="greensupia-products__hero">
                <Image
                  src="/product01.jpg"
                  alt="Your Eco-Friendly Solution"
                  width={600}
                  height={800}
                  className="greensupia-products__hero-image"
                />
              </div>

              {/* 오른쪽 이미지들 */}
              <div className="greensupia-products__cards">
                <Image
                  src="/product02.jpg"
                  alt="현수막·배너"
                  width={600}
                  height={200}
                  className="greensupia-products__card-img"
                />
                <Image
                  src="/product03.jpg"
                  alt="농업용 멀칭필름"
                  width={600}
                  height={200}
                  className="greensupia-products__card-img"
                />
                <Image
                  src="/product04.jpg"
                  alt="일회용품 라인"
                  width={600}
                  height={200}
                  className="greensupia-products__card-img"
                />
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}
