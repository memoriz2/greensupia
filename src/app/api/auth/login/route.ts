import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "@/utils/encryption";
import { getJWTSecret } from "@/lib/env";
import jwt from "jsonwebtoken";

interface LoginRequest {
  username: string;
  password: string;
}

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // 입력 검증
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "사용자명과 비밀번호를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // 데이터베이스에서 관리자 찾기
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "사용자명이 올바르지 않습니다.",
        },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isPasswordValid = verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "비밀번호가 올바르지 않습니다.",
        },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const jwtSecret = getJWTSecret();
    const token = jwt.sign(
      {
        userId: admin.id,
        username: admin.username,
        userType: "admin",
        name: "관리자",
      },
      jwtSecret,
      { expiresIn: "30m" } // 24시간 → 30분으로 변경
    );

    const response = NextResponse.json({
      success: true,
      message: "로그인에 성공했습니다.",
      token,
      userType: "admin",
      user: {
        id: admin.id,
        username: admin.username,
        name: "관리자",
        userType: "admin",
      },
    });

    // 쿠키 설정
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60, // 30분
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
