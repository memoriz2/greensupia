"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

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
      {!isAdminPortal && (
        <footer>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 Greensupia. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
