import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface LoginRequest {
  username: string;
  password: string;
  userType: "admin" | "guest";
}

interface User {
  id: number;
  username: string;
  password: string;
  userType: "admin" | "guest";
  name: string;
}

// 임시 사용자 데이터 (실제로는 데이터베이스에서 관리)
const users: User[] = [
  {
    id: 1,
    username: "admin",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    userType: "admin",
    name: "관리자",
  },
  {
    id: 2,
    username: "guest",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    userType: "guest",
    name: "게스트",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password, userType } = body;

    // 입력 검증
    if (!username || !password || !userType) {
      return NextResponse.json(
        {
          success: false,
          message: "사용자명, 비밀번호, 사용자 타입을 모두 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = users.find(
      (u) => u.username === username && u.userType === userType
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "사용자명 또는 사용자 타입이 올바르지 않습니다.",
        },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);

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
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        userType: user.userType,
        name: user.name,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({
      success: true,
      message: "로그인에 성공했습니다.",
      token,
      userType: user.userType,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        userType: user.userType,
      },
    });

    // 쿠키 설정
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24시간
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
  }
}
