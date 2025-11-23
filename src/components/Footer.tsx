"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <>
      <div className="greensupia-contact" style={{ backgroundImage: 'url(/footer_back.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="greensupia-contact__container">
          <div className="greensupia-contact__content">
            {/* 주소 정보 카드 */}
            <div className="greensupia-contact__info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start' }}>
                <Image
                  src="/title_blit.jpg"
                  alt=""
                  width={22}
                  height={21}
                  className="greensupia-contact__title-icon"
                />
                <h2 className="greensupia-contact__title">회사정보</h2>
              </div>
              <div className="greensupia-contact__info-content">
                  <Image
                    src="/business_card.jpg"
                    alt="회사정보"
                    width={1905}
                    height={557}
                    className="greensupia-contact__info-image"
                  />
              </div>
            </div>

            {/* 지도 */}
            <div className="greensupia-contact__map">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start' }}>
                <Image
                  src="/title_blit.jpg"
                  alt=""
                  width={22}
                  height={21}
                  className="greensupia-contact__title-icon"
                />
                <h2 className="greensupia-contact__title">오시는 길</h2>
              </div>
              <div className="greensupia-map__container">
                <iframe
                  src="https://maps.google.com/maps?q=33.4996,126.5226&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="greensupia-contact__copyright-wrapper">
        <div className="greensupia-contact__copyright">
          <p>© 2024 Greensupia. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
