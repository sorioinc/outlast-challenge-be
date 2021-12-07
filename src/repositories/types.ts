export interface PersistenceLayer<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | undefined>;
  insert(item: T): Promise<T>;
  update(item: T): Promise<T>;

  changeDatabase(database: string): this;
}
