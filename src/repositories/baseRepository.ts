import { Id } from "@/types/utils";

//기본 Repository 인터페이스
export interface IRepository<
  T,
  CreateData = Partial<T>,
  UpdateData = Partial<T>
> {
  findAll(): Promise<T[]>;
  findById(id: Id): Promise<T | null>;
  create(data: CreateData): Promise<T>;
  update(id: Id, data: UpdateData): Promise<T>;
  delete(id: Id): Promise<void>;
  exists(id: Id): Promise<boolean>;
}

export interface IPaginatedRepository<
  T,
  CreateData = Partial<T>,
  UpdateData = Partial<T>
> extends IRepository<T, CreateData, UpdateData> {
  findWithPagination(
    page: number,
    limit: number
  ): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
}

export interface IFilterableRepository<
  T,
  Filters = Record<string, unknown>,
  CreateData = Partial<T>,
  UpdateData = Partial<T>
> extends IRepository<T, CreateData, UpdateData> {
  findByFilters(filters: Filters): Promise<T[]>;
}
