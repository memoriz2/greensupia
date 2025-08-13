"use client";

import Script from "next/script";

interface NaverSearchAdvisorProps {
  NAVER_CLIENT_ID: string;
}

export default function NaverSearchAdvisor({
  NAVER_CLIENT_ID,
}: NaverSearchAdvisorProps) {
  return (
    <>
      <Script
        id="naver-search-advisor"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var w = window;
              if (w.naver_analytics) return;
              w.naver_analytics = {
                log: function() {
                  if (w.naver_analytics && w.naver_analytics.log) {
                    w.naver_analytics.log.apply(w.naver_analytics, arguments);
                  }
                }
              };
              var d = document, s = d.createElement('script'), e = d.getElementsByTagName('script')[0];
              s.type = 'text/javascript';
              s.async = true;
              s.src = 'https://wcs.naver.net/wcslog.js';
              e.parentNode.insertBefore(s, e);
            })();
          `,
        }}
      />
    </>
  );
}
