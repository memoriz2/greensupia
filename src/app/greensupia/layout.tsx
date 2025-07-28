import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.scss";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Greensupia - 전문 웹 개발 서비스",
  description:
    "Greensupia는 혁신적인 웹 개발 솔루션을 제공하는 전문 회사입니다. 최신 기술과 창의적인 디자인으로 비즈니스의 디지털 성장을 돕습니다.",
  keywords: "웹 개발, 웹사이트 제작, 반응형 웹, SEO 최적화, 웹 디자인",
};

export default function GreensupiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geist.variable} min-h-screen bg-gray-50`}>
      {children}
    </div>
  );
}
