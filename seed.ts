import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 데이터베이스 시드 시작...");

  // Todo 샘플 데이터
  await prisma.todo.createMany({
    data: [
      {
        title: "프로젝트 기획서 작성",
        description: "Q1 프로젝트 기획서 완성",
        completed: false,
      },
      {
        title: "데이터베이스 설계",
        description: "새로운 기능을 위한 DB 스키마 설계",
        completed: true,
      },
      {
        title: "API 문서 작성",
        description: "REST API 문서 업데이트",
        completed: false,
      },
    ],
    skipDuplicates: true,
  });

  // 조직도 샘플 데이터 (로컬 이미지 파일 사용)
  await prisma.organizationChart.createMany({
    data: [
      {
        imageUrl: "/organization-charts/1753300508151_jzi5joe6ht.png",
        isActive: true,
      },
      {
        imageUrl: "/organization-charts/1753300613828_byl2zm1anff.png",
        isActive: false,
      },
      {
        imageUrl: "/organization-charts/1753300622563_h8lndpn9xao.png",
        isActive: false,
      },
    ],
    skipDuplicates: true,
  });

  // 히스토리 샘플 데이터 (새로운 스키마)
  await prisma.history.createMany({
    data: [
      {
        year: "2020",
        description: "JSEO 회사 설립 - 혁신적인 기술 솔루션으로 시작",
        sortOrder: 1,
        isActive: true,
      },
      {
        year: "2022",
        description: "10억원 시리즈 A 투자 유치 - 급속한 성장의 시작",
        sortOrder: 2,
        isActive: true,
      },
      {
        year: "2023",
        description: "동남아시아 시장 진출 - 글로벌 확장의 첫 걸음",
        sortOrder: 3,
        isActive: true,
      },
      {
        year: "2024",
        description: "AI 기술 도입 및 서비스 고도화 - 미래 기술 선도",
        sortOrder: 4,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  // 배너뉴스 샘플 데이터 (Greensupia 실제 데이터 기반)
  await prisma.bannerNews.createMany({
    data: [
      {
        title: "그린수피아 새로운 서비스 출시",
        content:
          "친환경 기술을 활용한 혁신적인 서비스가 출시되었습니다. 지속가능한 미래를 위한 그린수피아의 새로운 도약을 만나보세요.",
        imageUrl: "/banner-news/15cb56b8-1753-4a0b-ace8-da45732b86c7.jpg",
        linkUrl: "https://greensupia.com/new-service",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "환경 보호 캠페인",
        content:
          "지구를 지키는 작은 실천, 그린수피아와 함께하는 환경 보호 캠페인에 참여하세요. 우리의 미래를 위한 소중한 한 걸음입니다.",
        imageUrl: "/banner-news/bf518506-e3f4-4d15-8aac-3adc4e050001.jpg",
        linkUrl: "https://greensupia.com/campaign",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-12-31"),
        sortOrder: 2,
        isActive: true,
      },
      {
        title: "친환경 제품 라인업",
        content:
          "자연과 조화를 이루는 친환경 제품들을 소개합니다. 그린수피아만의 특별한 기술로 만든 제품들을 만나보세요.",
        imageUrl: "/banner-news/19328fc2-4915-4ba0-9c62-c16b8f1fce9c.jpg",
        linkUrl: "https://greensupia.com/products",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-12-31"),
        sortOrder: 3,
        isActive: true,
      },
      {
        title: "기업 문화 소개",
        content:
          "그린수피아의 특별한 기업 문화를 소개합니다. 환경과 사람을 생각하는 따뜻한 마음으로 함께 성장하는 회사입니다.",
        imageUrl: "/banner-news/c1e91bcb-364f-4432-8e82-3ec7021e0c79.png",
        linkUrl: "https://greensupia.com/culture",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-12-31"),
        sortOrder: 4,
        isActive: true,
      },
      {
        title: "연구 개발 센터",
        content:
          "미래 기술을 선도하는 그린수피아 연구 개발 센터를 소개합니다. 지속가능한 기술 개발을 위한 끊임없는 도전을 이어가고 있습니다.",
        imageUrl: "/banner-news/6fc64b91-84ad-420a-b877-b33ee1e8abad.png",
        linkUrl: "https://greensupia.com/research",
        startDate: new Date("2024-05-01"),
        endDate: new Date("2024-12-31"),
        sortOrder: 5,
        isActive: true,
      },
      {
        title: "글로벌 파트너십",
        content:
          "전 세계와 함께하는 그린수피아의 글로벌 파트너십을 소개합니다. 국제적인 협력을 통해 더 큰 변화를 만들어갑니다.",
        imageUrl: "/banner-news/6c93fd04-f6b5-4c0f-b50b-54c3a93f068e.png",
        linkUrl: "https://greensupia.com/partnership",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-12-31"),
        sortOrder: 6,
        isActive: true,
      },
      {
        title: "연말 감사 이벤트",
        content:
          "그린수피아를 사랑해주시는 고객 여러분께 감사드립니다. 연말을 맞아 특별한 혜택과 함께하는 감사 이벤트를 준비했습니다.",
        imageUrl: "/banner-news/26390a7e-486a-43dc-80dc-69439f4a3e1d.png",
        linkUrl: "https://greensupia.com/event",
        startDate: new Date("2024-12-01"),
        endDate: new Date("2024-12-31"),
        sortOrder: 7,
        isActive: false,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ 시드 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 데이터 생성 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
