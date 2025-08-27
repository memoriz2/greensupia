import { HistoryRepository } from "@/repositories/historyRepository";
import {
  history,
  createHistoryRequest,
  updateHistoryRequest,
  historyFilters,
} from "@/types/history";
import { ApiResponse } from "@/types/api";
import { Id } from "@/types/utils";

export class HistoryService {
  private historyRepository: HistoryRepository;

  constructor() {
    this.historyRepository = new HistoryRepository();
  }

  async getAllHistories(): Promise<ApiResponse<history[]>> {
    try {
      const histories = await this.historyRepository.findAll();
      return {
        success: true,
        data: histories,
        message: "Histories retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve histories: ${error}`,
      };
    }
  }

  async getHistoryById(id: Id): Promise<ApiResponse<history>> {
    try {
      const history = await this.historyRepository.findById(id);
      if (!history) {
        return {
          success: false,
          error: "History not found",
        };
      }
      return {
        success: true,
        data: history,
        message: "History retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve history: ${error}`,
      };
    }
  }

  async createHistory(
    data: createHistoryRequest
  ): Promise<ApiResponse<history>> {
    try {
      const history = await this.historyRepository.create(data);
      return {
        success: true,
        data: history,
        message: "History created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create history: ${error}`,
      };
    }
  }

  async updateHistory(
    id: Id,
    data: updateHistoryRequest
  ): Promise<ApiResponse<history>> {
    try {
      const existingHistory = await this.historyRepository.findById(id);
      if (!existingHistory) {
        return {
          success: false,
          error: "History not found",
        };
      }

      const updatedHistory = await this.historyRepository.update(id, data);
      return {
        success: true,
        data: updatedHistory,
        message: "History updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update history: ${error}`,
      };
    }
  }

  async deleteHistory(id: Id): Promise<ApiResponse<boolean>> {
    try {
      const existingHistory = await this.historyRepository.findById(id);
      if (!existingHistory) {
        return {
          success: false,
          error: "History not found",
        };
      }

      await this.historyRepository.delete(id);
      return {
        success: true,
        data: true,
        message: "History deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete history: ${error}`,
      };
    }
  }

  async getHistoriesByFilters(
    filters: historyFilters
  ): Promise<ApiResponse<history[]>> {
    try {
      const histories = await this.historyRepository.findByFilters(filters);
      return {
        success: true,
        data: histories,
        message: `Found ${histories.length} histories matching filters`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve histories with filters: ${error}`,
      };
    }
  }

  async getHistoriesByYearRange(
    startYear: string,
    endYear: string
  ): Promise<ApiResponse<history[]>> {
    try {
      const histories = await this.historyRepository.findByYearRange(
        startYear,
        endYear
      );
      return {
        success: true,
        data: histories,
        message: `Found ${histories.length} histories between ${startYear} and ${endYear}`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve histories by year range: ${error}`,
      };
    }
  }

  async getHistoryStats(): Promise<
    ApiResponse<{
      total: number;
      yearRange: { min: string; max: string };
      yearStats: { [key: string]: number };
      recentHistories: history[];
    }>
  > {
    try {
      const allHistories = await this.historyRepository.findAll();

      const total = allHistories.length;
      const years = allHistories.map((history) => history.year);
      const yearRange = {
        min: years.reduce((min, year) => (year < min ? year : min), years[0]),
        max: years.reduce((max, year) => (year > max ? year : max), years[0]),
      };

      const yearStats: { [key: string]: number } = {};
      years.forEach((year) => {
        yearStats[year] = (yearStats[year] || 0) + 1;
      });

      const recentHistories = allHistories
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      return {
        success: true,
        data: {
          total,
          yearRange,
          yearStats,
          recentHistories,
        },
        message: "History statistics retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve history statistics: ${error}`,
      };
    }
  }
}
