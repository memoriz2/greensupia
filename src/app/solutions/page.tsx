"use client";

import Image from "next/image";

export default function SolutionsPage() {
  return (
    <div className="greensupia-page">
      {/* 탑배너 */}
      <section className="greensupia-page__banner greensupia-page__banner--full greensupia-solutions__banner">
        <Image
          src="/solution_tbanner.jpg"
          alt="솔루션"
          width={1905}
          height={400}
          priority
          className="greensupia-page__banner-image greensupia-solutions__banner-image"
          style={{ height: 'auto' }}
        />
      </section>

      <main className="greensupia-page__content">
        {/* 솔루션 타이틀 */}
        <section className="greensupia-page__section">
          <Image
            src="/sol_titile.png"
            alt="솔루션 타이틀"
            width={400}
            height={100}
            className="greensupia-solutions__title-image"
          />
        </section>

        {/* 솔루션 콘텐츠 */}
        <section className="greensupia-page__section greensupia-solutions__content">
          <Image
            src="/solution_content.jpg"
            alt="솔루션 콘텐츠"
            width={1905}
            height={800}
            className="greensupia-solutions__content-image"
            style={{ height: 'auto' }}
          />
        </section>
      </main>
    </div>
  );
}
