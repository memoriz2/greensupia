"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPortal = pathname.startsWith("/portal");

  return (
    <>
      {!isAdminPortal && <Header />}
      <main>{children}</main>
      {!isAdminPortal && <Footer />}
    </>
  );
}
