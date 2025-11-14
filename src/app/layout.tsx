import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.scss";
import ConditionalLayout from "@/components/ConditionalLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import VisitorLogger from "@/components/VisitorLogger";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: {
    default: "그린수피아(Greensupia) - 친환경 비닐 제작업체",
    template: "%s | 그린수피아(Greensupia)",
  },
  description:
    "그린수피아(Greensupia)는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다. 환경을 생각하는 농업인의 선택입니다.",
  keywords: [
    "그린수피아",
    "Greensupia",
    "친환경 비닐",
    "농업",
    "지속가능",
    "환경보호",
    "농사용품",
    "친환경 농자재",
    "농업용 비닐",
    "친환경 농업",
    "지속가능한 농업",
    "비닐하우스",
    "농업용품 제조업",
    "친환경 소재",
    "농업 솔루션",
  ],
  authors: [{ name: "그린수피아(Greensupia)" }],
  creator: "그린수피아(Greensupia)",
  publisher: "그린수피아(Greensupia)",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.greensupia.com"),
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.greensupia.com",
    title: "그린수피아(Greensupia) - 친환경 비닐 제작업체",
    description:
      "그린수피아(Greensupia)는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
    siteName: "그린수피아(Greensupia)",
    images: [
      {
        url: "/greensupia-og.jpg",
        width: 1200,
        height: 630,
        alt: "그린수피아 친환경 비닐",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "그린수피아(Greensupia) - 친환경 비닐 제작업체",
    description:
      "그린수피아(Greensupia)는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
    images: ["/greensupia-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "xEZ76J92M9LwzjzAuyiAbyg39cIZ7ywbgLQm4egg1aw",
  },
  other: {
    "naver-site-verification": "a51be3d0afbb84d1c24832ccb255986de60286e9",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} greensupia-layout`}>
        <ConditionalLayout>{children}</ConditionalLayout>

        {/* 방문자 로그 자동 기록 */}
        <VisitorLogger />

        {/* Google Analytics */}
        <GoogleAnalytics
          GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""}
        />
      </body>
    </html>
  );
}
