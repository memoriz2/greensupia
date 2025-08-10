/** @type {import('next').NextConfig} */
const nextConfig = {
  // deprecated된 옵션 제거
  // experimental: {
  //   serverComponentsExternalPackages: ['prisma']
  // },

  // 새로운 옵션으로 변경
  serverExternalPackages: ["prisma"],

  // 이미지 최적화 설정
  images: {
    domains: ["localhost", "img.youtube.com"],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },

  // 성능 최적화 강화
  compress: true,

  // 개발 환경 최적화
  ...(process.env.NODE_ENV === "development" && {
    reactStrictMode: false, // 개발 시 성능 향상
    experimental: {
      optimizeCss: false, // critters 오류 방지
      optimizePackageImports: ["react", "react-dom"],
    },
  }),

  // 프로덕션 최적화
  ...(process.env.NODE_ENV === "production" && {
    experimental: {
      optimizeCss: false, // critters 오류 방지
      optimizePackageImports: ["react", "react-dom"],
    },
  }),

  // 웹팩 최적화
  webpack: (
    config: any,
    { dev, isServer }: { dev: boolean; isServer: boolean }
  ) => {
    if (!dev && !isServer) {
      // 프로덕션 빌드 최적화
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
