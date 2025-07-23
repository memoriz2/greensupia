import { prisma } from "@/lib/prisma";
import {
  OrganizationChart,
  CreateOrganizationChartRequest,
  UpdateOrganizationChartRequest,
} from "@/types/organization";
import { Id } from "@/types/utils";

export class OrganizationChartRepository {
  async findAll(): Promise<OrganizationChart[]> {
    try {
      return await prisma.organizationChart.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch organization charts: ${error}`);
    }
  }

  async findActive(): Promise<OrganizationChart | null> {
    try {
      return await prisma.organizationChart.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch active organization chart: ${error}`);
    }
  }

  async findById(id: Id): Promise<OrganizationChart | null> {
    try {
      return await prisma.organizationChart.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch organization chart with id ${id}: ${error}`
      );
    }
  }

  async create(
    data: CreateOrganizationChartRequest
  ): Promise<OrganizationChart> {
    try {
      return await prisma.organizationChart.create({
        data: {
          imageUrl: data.imageUrl,
          isActive: data.isActive ?? true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create organization chart: ${error}`);
    }
  }

  async update(
    id: Id,
    data: UpdateOrganizationChartRequest
  ): Promise<OrganizationChart> {
    try {
      const updateData: any = {};
      if (data.imageUrl !== undefined) {
        updateData.imageUrl = data.imageUrl;
      }
      if (data.isActive !== undefined) {
        updateData.isActive = data.isActive;
      }

      return await prisma.organizationChart.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new Error(
        `Failed to update organization chart with id ${id}: ${error}`
      );
    }
  }

  async delete(id: Id): Promise<void> {
    try {
      await prisma.organizationChart.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        `Failed to delete organization chart with id ${id}: ${error}`
      );
    }
  }

  async deactivateAll(): Promise<void> {
    try {
      await prisma.organizationChart.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    } catch (error) {
      throw new Error(`Failed to deactivate all organization charts: ${error}`);
    }
  }

  async exists(id: Id): Promise<boolean> {
    try {
      const orgChart = await prisma.organizationChart.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!orgChart;
    } catch (error) {
      throw new Error(
        `Failed to check organization chart existence with id ${id}: ${error}`
      );
    }
  }
}
