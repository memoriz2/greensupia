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

    // 간단한 방식: 모든 방문자 수에서 관리자 경로 접근 수를 빼기
    // 실제 구현에서는 Prisma가 정상 작동할 때 더 정교한 쿼리 사용

    try {
      // 전체 방문자 수 (봇 제외)
      const totalVisitors = await prisma.visitorlog.count({
        where: { isBot: false },
      });

      // 관리자 경로 접근 수 (봇 제외)
      const adminVisits = await prisma.visitorlog.count({
        where: {
          isBot: false,
          path: { startsWith: "/portal" },
        },
      });

      // 실제 방문자 수 = 전체 - 관리자
      const actualTotalVisitors = totalVisitors - adminVisits;

      // 오늘 방문자 수 계산
      const todayTotal = await prisma.visitorlog.count({
        where: {
          isBot: false,
          timestamp: { gte: today },
        },
      });

      const todayAdmin = await prisma.visitorlog.count({
        where: {
          isBot: false,
          path: { startsWith: "/portal" },
          timestamp: { gte: today },
        },
      });

      const todayVisitors = todayTotal - todayAdmin;

      // 이번 주 방문자 수 계산
      const weekTotal = await prisma.visitorlog.count({
        where: {
          isBot: false,
          timestamp: { gte: startOfWeek },
        },
      });

      const weekAdmin = await prisma.visitorlog.count({
        where: {
          isBot: false,
          path: { startsWith: "/portal" },
          timestamp: { gte: startOfWeek },
        },
      });

      const thisWeekVisitors = weekTotal - weekAdmin;

      // 이번 달 방문자 수 계산
      const monthTotal = await prisma.visitorlog.count({
        where: {
          isBot: false,
          timestamp: { gte: startOfMonth },
        },
      });

      const monthAdmin = await prisma.visitorlog.count({
        where: {
          isBot: false,
          path: { startsWith: "/portal" },
          timestamp: { gte: startOfMonth },
        },
      });

      const thisMonthVisitors = monthTotal - monthAdmin;

      const stats = {
        total: actualTotalVisitors,
        today: todayVisitors,
        thisWeek: thisWeekVisitors,
        thisMonth: thisMonthVisitors,
        note: "관리자 경로(/portal/*) 접근은 통계에서 제외됨",
      };

      return NextResponse.json(stats);
    } catch (prismaError) {
      console.error("Prisma 쿼리 오류:", prismaError);

      // Prisma 오류 시 fallback 데이터 반환
      return NextResponse.json({
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        note: "데이터베이스 연결 오류로 인해 통계를 가져올 수 없습니다.",
      });
    }
  } catch (error) {
    console.error("방문자 통계 조회 오류:", error);

    // 에러 시 fallback 데이터 반환
    return NextResponse.json({
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      note: "통계 조회 중 오류가 발생했습니다.",
    });
  }
}
