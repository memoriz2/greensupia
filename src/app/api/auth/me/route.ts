import { NextRequest, NextResponse } from "next/server";
import { getJWTSecret } from "@/lib/env";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  username: string;
  userType: string;
  name: string;
}

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("authToken")?.value;

    if (!authToken) {
      return NextResponse.json({ userType: "guest" }, { status: 200 });
    }

    const jwtSecret = getJWTSecret();
    const decoded = jwt.verify(authToken, jwtSecret) as JWTPayload;

    return NextResponse.json({
      userType: decoded.userType,
      username: decoded.username,
      name: decoded.name,
    });
  } catch (error) {
    console.error("토큰 검증 오류:", error);
    return NextResponse.json({ userType: "guest" }, { status: 200 });
  }
}
