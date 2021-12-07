type ConstructableModelClass<T> = new (...rest: any[]) => T;

export type ModelClass<T> = ConstructableModelClass<T>;
