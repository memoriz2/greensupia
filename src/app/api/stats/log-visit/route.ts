import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { ip, userAgent, referer, path, isBot, botName } =
      await request.json();

    // 방문자 로그 기록
    await prisma.visitorlog.create({
      data: {
        ip: ip || null,
        userAgent: userAgent || null,
        referer: referer || null,
        path: path || "/",
        isBot: isBot || false,
        botName: botName || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("방문자 로그 기록 실패:", error);
    return NextResponse.json(
      { error: "방문자 로그 기록에 실패했습니다." },
      { status: 500 }
    );
  }
}
