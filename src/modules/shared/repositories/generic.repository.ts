export abstract class GenericRepository<T> {
  abstract create(item: T, ...args: any[]): Promise<void | boolean>;
  abstract save(item: T): Promise<void>;
  abstract findById(id: string): Promise<T>;
  abstract findAll(): Promise<T[]>;
}
