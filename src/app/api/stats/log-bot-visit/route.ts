import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userAgent, referer, path, botName } = await request.json();

    // 봇 방문 로그 기록
    await prisma.visitorlog.create({
      data: {
        ip: null, // 봇은 IP 추적 불필요
        userAgent: userAgent || null,
        referer: referer || null,
        path: path || "/",
        isBot: true,
        botName: botName || "알 수 없는 봇",
      },
    });

    console.log(`[봇 방문 기록] ${botName} - ${path} - ${userAgent}`);

    return NextResponse.json({
      success: true,
      botName: botName,
      note: "봇 방문 로그가 성공적으로 기록되었습니다.",
    });
  } catch (error) {
    console.error("봇 방문 로그 기록 실패:", error);
    return NextResponse.json(
      { error: "봇 방문 로그 기록에 실패했습니다." },
      { status: 500 }
    );
  }
}
