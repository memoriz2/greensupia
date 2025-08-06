import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.scss";
import {
  WebSiteStructuredData,
  OrganizationStructuredData,
} from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JSEO - 회사 소개",
    template: "%s | JSEO",
  },
  description:
    "JSEO는 전문적인 웹 개발 및 디지털 마케팅 서비스를 제공하는 회사입니다. 최신 기술과 창의적인 솔루션으로 고객의 비즈니스 성장을 지원합니다.",
  keywords: ["웹개발", "디지털마케팅", "SEO", "웹디자인", "JSEO"],
  authors: [{ name: "JSEO" }],
  creator: "JSEO",
  publisher: "JSEO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jseo.shop"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://jseo.shop",
    title: "JSEO - 회사 소개",
    description:
      "JSEO는 전문적인 웹 개발 및 디지털 마케팅 서비스를 제공하는 회사입니다.",
    siteName: "JSEO",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JSEO 회사 소개",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSEO - 회사 소개",
    description:
      "JSEO는 전문적인 웹 개발 및 디지털 마케팅 서비스를 제공하는 회사입니다.",
    images: ["/og-image.jpg"],
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
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <WebSiteStructuredData
          data={{
            name: "JSEO",
            url: "https://jseo.shop",
            description:
              "JSEO는 전문적인 웹 개발 및 디지털 마케팅 서비스를 제공하는 회사입니다.",
          }}
        />
        <OrganizationStructuredData
          data={{
            name: "JSEO",
            url: "https://jseo.shop",
            description:
              "JSEO는 전문적인 웹 개발 및 디지털 마케팅 서비스를 제공하는 회사입니다.",
            logo: "https://jseo.shop/logo.png",
            contactPoint: {
              telephone: "+82-XXX-XXXX-XXXX",
              contactType: "customer service",
            },
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
