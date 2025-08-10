import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.scss";
import ConditionalLayout from "@/components/ConditionalLayout";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: {
    default: "Greensupia - 친환경 비닐 제작업체",
    template: "%s | Greensupia",
  },
  description:
    "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다. 환경을 생각하는 농업인의 선택입니다.",
  keywords: [
    "친환경 비닐",
    "농업",
    "지속가능",
    "환경보호",
    "Greensupia",
    "농사용품",
  ],
  authors: [{ name: "Greensupia" }],
  creator: "Greensupia",
  publisher: "Greensupia",
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
    title: "Greensupia - 친환경 비닐 제작업체",
    description:
      "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
    siteName: "Greensupia",
    images: [
      {
        url: "/greensupia-og.jpg",
        width: 1200,
        height: 630,
        alt: "Greensupia 친환경 비닐",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greensupia - 친환경 비닐 제작업체",
    description:
      "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geist.variable} greensupia-layout`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
