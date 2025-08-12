import { OrganizationChartRepository } from "@/repositories/organizationChartRepository";
import { organizationchart } from "@prisma/client";
import {
  OrganizationChart,
  CreateOrganizationChartRequest,
  UpdateOrganizationChartRequest,
  OrganizationChartStats,
} from "@/types/organization";
import { ApiResponse } from "@/types/api";
import { Id } from "@/types/utils";

export class OrganizationChartService {
  private organizationChartRepository: OrganizationChartRepository;

  constructor() {
    this.organizationChartRepository = new OrganizationChartRepository();
  }

  async getAllOrganizationCharts(): Promise<ApiResponse<OrganizationChart[]>> {
    try {
      const organizationCharts =
        await this.organizationChartRepository.findAll();
      return {
        success: true,
        data: organizationCharts,
        message: "Organization charts retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve organization charts: ${error}`,
      };
    }
  }

  async getActiveOrganizationChart(): Promise<ApiResponse<OrganizationChart>> {
    try {
      const organizationChart =
        await this.organizationChartRepository.findActive();
      if (!organizationChart) {
        return {
          success: false,
          error: "활성화된 조직도가 없습니다.",
        };
      }
      return {
        success: true,
        data: organizationChart,
        message: "Active organization chart retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve active organization chart: ${error}`,
      };
    }
  }

  async getOrganizationChartById(
    id: Id
  ): Promise<ApiResponse<OrganizationChart>> {
    try {
      const organizationChart = await this.organizationChartRepository.findById(
        id
      );
      if (!organizationChart) {
        return {
          success: false,
          error: "Organization chart not found",
        };
      }
      return {
        success: true,
        data: organizationChart,
        message: "Organization chart retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve organization chart: ${error}`,
      };
    }
  }

  async createOrganizationChart(
    data: CreateOrganizationChartRequest
  ): Promise<ApiResponse<OrganizationChart>> {
    try {
      // 기존 활성 조직도를 비활성화
      if (data.isActive !== false) {
        await this.organizationChartRepository.deactivateAll();
      }

      const organizationChart = await this.organizationChartRepository.create(
        data
      );
      return {
        success: true,
        data: organizationChart,
        message: "Organization chart created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create organization chart: ${error}`,
      };
    }
  }

  async updateOrganizationChart(
    id: Id,
    data: UpdateOrganizationChartRequest
  ): Promise<ApiResponse<OrganizationChart>> {
    try {
      const existingOrgChart = await this.organizationChartRepository.findById(
        id
      );
      if (!existingOrgChart) {
        return {
          success: false,
          error: "Organization chart not found",
        };
      }

      // 활성화 상태 변경 시 기존 활성 조직도 비활성화
      if (data.isActive === true && !existingOrgChart.isActive) {
        await this.organizationChartRepository.deactivateAll();
      }

      const updatedOrgChart = await this.organizationChartRepository.update(
        id,
        data
      );
      return {
        success: true,
        data: updatedOrgChart,
        message: "Organization chart updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update organization chart: ${error}`,
      };
    }
  }

  async deleteOrganizationChart(id: Id): Promise<ApiResponse<boolean>> {
    try {
      const existingOrgChart = await this.organizationChartRepository.findById(
        id
      );
      if (!existingOrgChart) {
        return {
          success: false,
          error: "Organization chart not found",
        };
      }

      // 활성화된 조직도는 삭제 불가
      if (existingOrgChart.isActive) {
        return {
          success: false,
          error: "활성화된 조직도는 삭제할 수 없습니다.",
        };
      }

      await this.organizationChartRepository.delete(id);
      return {
        success: true,
        data: true,
        message: "Organization chart deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete organization chart: ${error}`,
      };
    }
  }

  async getOrganizationChartStats(): Promise<
    ApiResponse<OrganizationChartStats>
  > {
    try {
      const allOrgCharts = await this.organizationChartRepository.findAll();
      const active = allOrgCharts.filter((chart) => chart.isActive).length;
      const inactive = allOrgCharts.filter((chart) => !chart.isActive).length;

      return {
        success: true,
        data: {
          total: allOrgCharts.length,
          active,
          inactive,
        },
        message: "Organization chart statistics retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve organization chart statistics: ${error}`,
      };
    }
  }
}
