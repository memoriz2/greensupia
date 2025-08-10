import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/encryption";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");
  console.log("⚠️  This will DELETE ALL existing data and recreate seed data!");
  console.log(
    "⚠️  Are you sure? (Ctrl+C to cancel, or wait 5 seconds to continue)"
  );

  // 5초 대기 (취소할 시간 제공)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 0. 기존 시드 데이터 정리 (중복 방지)
  console.log("Cleaning up existing seed data...");
  await prisma.admin.deleteMany({});
  await prisma.organizationchart.deleteMany({});
  await prisma.history.deleteMany({});
  await prisma.bannernews.deleteMany({});

  console.log("✅ Existing data cleaned up");

  // 1. Admin 계정 생성
  console.log("Creating admin account...");
  await prisma.admin.create({
    data: {
      username: "admin",
      password: hashPassword("admin123"),
      updatedAt: new Date(),
    },
  });
  console.log("✅ Admin account created (username: admin, password: admin123)");

  // 1. Organization Chart 데이터 생성
  console.log("Creating organization chart data...");
  await prisma.organizationchart.createMany({
    data: [
      {
        imageUrl: "/organizationcharts/1753306012386_kirizbvf03e.png",
        isActive: true,
        updatedAt: new Date(),
      },
      {
        imageUrl: "/organizationcharts/1753306007834_i9iwjwel8an.png",
        isActive: true,
        updatedAt: new Date(),
      },
      {
        imageUrl: "/organizationcharts/1753300627007_csgmkkq317e.png",
        isActive: true,
        updatedAt: new Date(),
      },
    ],
  });

  // 3. History 데이터 생성
  console.log("Creating history data...");
  await prisma.history.createMany({
    data: [
      {
        year: "2020",
        description: "회사 설립",
        sortOrder: 1,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        year: "2022",
        description: "시리즈 A 투자 유치",
        sortOrder: 2,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        year: "2023",
        description: "해외 진출",
        sortOrder: 3,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        year: "2024",
        description: "IPO 준비",
        sortOrder: 4,
        isActive: true,
        updatedAt: new Date(),
      },
    ],
  });

  // 4. Banner News 데이터 생성
  console.log("Creating banner news data...");
  await prisma.bannernews.createMany({
    data: [
      {
        title: "신제품 출시",
        content: "혁신적인 신제품이 출시되었습니다.",
        imageUrl: "/banner-news/15cb56b8-1753-4a0b-ace8-da45732b86c7.jpg",
        linkUrl: "/news/1",
        sortOrder: 1,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "회사 소식",
        content: "회사의 최신 소식을 확인하세요.",
        imageUrl: "/banner-news/bf518506-e3f4-4d15-8aac-3adc4e050001.jpg",
        linkUrl: "/news/2",
        sortOrder: 2,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "기술 혁신",
        content: "최신 기술을 활용한 서비스 업그레이드",
        imageUrl: "/banner-news/c1e91bcb-364f-4432-8e82-3ec7021e0c79.png",
        linkUrl: "/news/3",
        sortOrder: 3,
        isActive: true,
        updatedAt: new Date(),
      },
      {
        title: "고객 만족도 향상",
        content: "고객 피드백을 반영한 서비스 개선",
        imageUrl: "/banner-news/6c93fd04-f6b5-4c0f-b50b-54c3a93f068e.png",
        linkUrl: "/news/4",
        sortOrder: 4,
        isActive: true,
        updatedAt: new Date(),
      },
    ],
  });

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
