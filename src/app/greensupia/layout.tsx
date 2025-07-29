import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.scss";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Greensupia",
  description: "Greensupia는 친환경 비닐 제작업체입니다다",
  keywords: "농사, 친환경 비닐",
};

export default function GreensupiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geist.variable} greensupia-layout`}>
      <div className="greensupia-background">
        <div className="greensupia-overlay">{children}</div>
      </div>
    </div>
  );
}
