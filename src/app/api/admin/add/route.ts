import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/utils/encryption";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 입력값 검증
    if (!username || !password) {
      return NextResponse.json(
        { message: "사용자명과 비밀번호는 필수입니다." },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { message: "사용자명은 최소 3자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "비밀번호는 최소 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 사용자명 중복 확인
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "이미 존재하는 사용자명입니다." },
        { status: 409 }
      );
    }

    // 비밀번호 해시화
    const hashedPassword = hashPassword(password);

    // 관리자 계정 생성
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // 비밀번호는 응답에서 제외
    const { password: _, ...adminWithoutPassword } = newAdmin;

    return NextResponse.json(
      {
        message: "관리자 계정이 성공적으로 생성되었습니다.",
        admin: adminWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("관리자 계정 생성 오류:", error);

    return NextResponse.json(
      {
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
