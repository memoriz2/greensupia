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

  // 조직도 샘플 데이터
  await prisma.organizationChart.createMany({
    data: [
      {
        name: "김철수",
        position: "CEO",
        department: "경영진",
        level: 0,
        parentId: null,
      },
      {
        name: "이영희",
        position: "CTO",
        department: "기술팀",
        level: 1,
        parentId: 1,
      },
      {
        name: "박민수",
        position: "개발팀장",
        department: "개발팀",
        level: 2,
        parentId: 2,
      },
    ],
    skipDuplicates: true,
  });

  // 히스토리 샘플 데이터
  await prisma.history.createMany({
    data: [
      {
        title: "회사 설립",
        content: "JSEO 회사 설립",
        year: 2020,
      },
      {
        title: "시리즈 A 투자",
        content: "10억원 시리즈 A 투자 유치",
        year: 2022,
      },
      {
        title: "해외 진출",
        content: "동남아시아 시장 진출",
        year: 2023,
      },
    ],
    skipDuplicates: true,
  });

  // 배너뉴스 샘플 데이터
  await prisma.bannerNews.createMany({
    data: [
      {
        title: "새로운 서비스 출시",
        content: "AI 기반 분석 서비스가 출시되었습니다.",
        imageUrl: "https://via.placeholder.com/400x200",
        isActive: true,
      },
      {
        title: "채용 공고",
        content: "우수한 개발자를 모집합니다.",
        imageUrl: "https://via.placeholder.com/400x200",
        isActive: true,
      },
      {
        title: "연말 이벤트",
        content: "연말 감사 이벤트를 진행합니다.",
        imageUrl: "https://via.placeholder.com/400x200",
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
