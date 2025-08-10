import { NextRequest, NextResponse } from "next/server";
import { OrganizationChartService } from "@/services/organizationChartService";
import { uploadImage } from "@/utils/fileUpload";

const organizationChartService = new OrganizationChartService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // 통계 조회
    if (action === "stats") {
      const result = await organizationChartService.getOrganizationChartStats();
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json(result.data, { status: 200 });
    }

    // 활성 조직도 조회
    if (action === "active") {
      const result =
        await organizationChartService.getActiveOrganizationChart();
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json(result.data, { status: 200 });
    }

    // 기본 전체 조회
    const result = await organizationChartService.getAllOrganizationCharts();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Organization API 에러: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("imageFile") as File;
    const isActive = formData.get("isActive") === "true";

    if (!imageFile) {
      return NextResponse.json(
        { error: "이미지 파일이 필요합니다." },
        { status: 400 }
      );
    }

    // 이미지 업로드 (조직도 폴더 지정)
    const uploadResult = await uploadImage(imageFile, "organizationcharts");

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || "이미지 업로드에 실패했습니다." },
        { status: 500 }
      );
    }

    const result = await organizationChartService.createOrganizationChart({
      imageUrl: uploadResult.imageUrl || "",
      isActive,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Organization POST 에러: ", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
