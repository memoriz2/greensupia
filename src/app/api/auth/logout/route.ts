import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "로그아웃되었습니다.",
    });

    // 쿠키 삭제
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // 즉시 만료
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("로그아웃 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "로그아웃 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
