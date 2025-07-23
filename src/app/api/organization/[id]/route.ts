import { NextRequest, NextResponse } from "next/server";
import { OrganizationChartService } from "@/services/organizationChartService";
import { UpdateOrganizationChartRequest } from "@/types/organization";

const organizationChartService = new OrganizationChartService();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body: UpdateOrganizationChartRequest = await request.json();
    const result = await organizationChartService.updateOrganizationChart(
      id,
      body
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Organization PUT 에러: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await organizationChartService.deleteOrganizationChart(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Organization chart deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Organization DELETE 에러: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
