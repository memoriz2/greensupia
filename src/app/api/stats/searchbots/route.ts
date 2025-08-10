import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // 현재 날짜 기준으로 계산
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // 이번 주 일요일
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 4개 주요 봇 통계 조회
    const botStats = await Promise.all([
      // GoogleBot 통계
      prisma.visitorlog.count({
        where: {
          isBot: true,
          botName: "GoogleBot",
        },
      }),
      // BingBot 통계
      prisma.visitorlog.count({
        where: {
          isBot: true,
          botName: "BingBot",
        },
      }),
      // NaverBot 통계
      prisma.visitorlog.count({
        where: {
          isBot: true,
          botName: "NaverBot",
        },
      }),
      // DaumBot 통계
      prisma.visitorlog.count({
        where: {
          isBot: true,
          botName: "DaumBot",
        },
      }),
    ]);

    // 기타 봇 통계
    const otherBots = await prisma.visitorlog.count({
      where: {
        isBot: true,
        botName: "기타봇",
      },
    });

    // 오늘 방문한 봇 수
    const todayBots = await prisma.visitorlog.count({
      where: {
        isBot: true,
        timestamp: {
          gte: today,
        },
      },
    });

    // 이번 주 방문한 봇 수
    const thisWeekBots = await prisma.visitorlog.count({
      where: {
        isBot: true,
        timestamp: {
          gte: startOfWeek,
        },
      },
    });

    // 이번 달 방문한 봇 수
    const thisMonthBots = await prisma.visitorlog.count({
      where: {
        isBot: true,
        timestamp: {
          gte: startOfMonth,
        },
      },
    });

    // 총 봇 방문 수
    const totalBots = await prisma.visitorlog.count({
      where: {
        isBot: true,
      },
    });

    const stats = {
      total: totalBots,
      today: todayBots,
      thisWeek: thisWeekBots,
      thisMonth: thisMonthBots,
      topBots: [
        { name: "GoogleBot", count: botStats[0] },
        { name: "BingBot", count: botStats[1] },
        { name: "NaverBot", count: botStats[2] },
        { name: "DaumBot", count: botStats[3] },
        { name: "기타봇", count: otherBots },
      ],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("검색봇 통계 조회 오류:", error);

    // 에러 시 fallback 데이터 반환
    return NextResponse.json({
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      topBots: [
        { name: "GoogleBot", count: 0 },
        { name: "BingBot", count: 0 },
        { name: "NaverBot", count: 0 },
        { name: "DaumBot", count: 0 },
        { name: "기타봇", count: 0 },
      ],
    });
  }
}
