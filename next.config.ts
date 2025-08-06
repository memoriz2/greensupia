import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DOMAIN_URL: process.env.DOMAIN_URL,
    MAIN_DOMAIN: "jseo.shop",
    WWW_DOMAIN: "www.jseo.shop",
    ADMIN_DOMAIN: "portal.jseo.shop",
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // 가비아 호스팅을 위한 설정
  trailingSlash: true,
  experimental: {
    // 최신 기능 활성화
  },

  // 정적 파일 서빙 설정
  async headers() {
    return [
      {
        source: "/_next/static/css/:path*",
        headers: [
          {
            key: "Content-Type",
            value: "text/css; charset=utf-8",
          },
        ],
      },
      {
        source: "/_next/static/media/:path*",
        headers: [
          {
            key: "Content-Type",
            value: "font/woff2; charset=utf-8",
          },
        ],
      },
      {
        source: "/banner-news/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // SEO 최적화 헤더
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      // 관리자 페이지는 크롤링 제한
      {
        source: "/portal/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      // 문의하기 페이지는 비밀글이라 크롤링 제한
      {
        source: "/greensupia/contact",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  // 이미지 최적화 설정
  images: {
    unoptimized: true, // 가비아 서버에서 이미지 최적화 비활성화
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "jseo.shop",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.jseo.shop",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "portal.jseo.shop",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // 서버 설정 - IPv4 강제 사용
  serverRuntimeConfig: {
    hostname: "0.0.0.0",
    port: 3000,
  },
};

export default nextConfig;
