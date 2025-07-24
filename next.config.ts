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
  output: "standalone", // 독립 실행 가능한 빌드
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
    ];
  },
  // 이미지 최적화 설정
  images: {
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
    ],
  },
  // 서버 설정 - IPv4 강제 사용
  serverRuntimeConfig: {
    hostname: "0.0.0.0",
    port: 3000,
  },
};

export default nextConfig;
