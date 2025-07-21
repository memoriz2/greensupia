export type PartialUpdate<T> = Partial<T>;

export type Id = number;

export type ISODateString = string;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type MakeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
