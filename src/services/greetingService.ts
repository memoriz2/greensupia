import { GreetingRepository } from "@/repositories/greetingRepository";
import {
  greetingCreateRequest,
  greetingUpdateRequest,
  greetingResponse,
  greetingListResponse,
} from "@/types/greeting";

export class GreetingService {
  private greetingRepository: GreetingRepository;

  constructor(greetingRepository: GreetingRepository) {
    this.greetingRepository = greetingRepository;
  }

  async getAllGreetings(
    page: number = 0,
    size: number = 10
  ): Promise<greetingListResponse> {
    const result = await this.greetingRepository.findWithPagination(page, size);
    return {
      content: result.data.map((greeting) =>
        this.greetingRepository.toResponse(greeting)
      ),
      totalElements: result.pagination.total,
      totalPages: result.pagination.totalPages,
      size: result.pagination.limit,
      number: result.pagination.page,
    };
  }

  async getActiveGreetings(): Promise<greetingResponse[]> {
    const greetings = await this.greetingRepository.findActive();
    return greetings.map((greeting) =>
      this.greetingRepository.toResponse(greeting)
    );
  }

  async getGreetingById(id: number): Promise<greetingResponse> {
    const greeting = await this.greetingRepository.findById(id);
    if (!greeting) {
      throw new Error("Greeting not found");
    }
    return this.greetingRepository.toResponse(greeting);
  }

  async createGreeting(data: greetingCreateRequest): Promise<greetingResponse> {
    const greeting = await this.greetingRepository.create(data);
    return this.greetingRepository.toResponse(greeting);
  }

  async updateGreeting(
    id: number,
    data: greetingUpdateRequest
  ): Promise<greetingResponse> {
    const greeting = await this.greetingRepository.update(id, data);
    return this.greetingRepository.toResponse(greeting);
  }

  async deleteGreeting(id: number): Promise<void> {
    await this.greetingRepository.delete(id);
  }

  async toggleGreetingActive(id: number): Promise<greetingResponse> {
    const greeting = await this.greetingRepository.toggleActive(id);
    return this.greetingRepository.toResponse(greeting);
  }
}
