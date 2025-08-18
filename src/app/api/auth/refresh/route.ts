import { NextRequest, NextResponse } from "next/server";
import { getJWTSecret } from "@/lib/env";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  username: string;
  userType: string;
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get("authToken")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    const jwtSecret = getJWTSecret();
    const decoded = jwt.verify(authToken, jwtSecret) as JWTPayload;

    // 새로운 토큰 생성 (30분 연장)
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        userType: decoded.userType,
        name: decoded.name,
      },
      jwtSecret,
      { expiresIn: "30m" }
    );

    const response = NextResponse.json({
      success: true,
      message: "세션이 연장되었습니다.",
    });

    // 새로운 쿠키 설정
    response.cookies.set("authToken", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60, // 30분
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("세션 연장 오류:", error);
    return NextResponse.json(
      { success: false, message: "세션 연장에 실패했습니다." },
      { status: 401 }
    );
  }
}
