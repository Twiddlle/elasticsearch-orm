export interface EsBulkResponseInterface<T> {
  entities: T[];
  raw: any;
  hasErrors: boolean;
}

export interface EsDeleteBulkResponseInterface {
  raw: any;
  hasErrors: boolean;
}

export interface EsResponseInterface<T> {
  entity: T;
  raw: any;
}

export interface EsResponseDeleteByQueryInterface {
  deleted: number;
  raw: any;
}

export interface EsCollectionResponseInterface<T> {
  entities: T[];
  raw: any;
}
