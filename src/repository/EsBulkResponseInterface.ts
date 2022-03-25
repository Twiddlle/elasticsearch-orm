export interface EsBulkResponseInterface<T> {
  entities: T[];
  raw: any;
  hasErrors: boolean;
}

export interface EsDeleteBulkResponseInterface<T> {
  raw: any;
  hasErrors: boolean;
}

export interface EsResponseInterface<T> {
  entity: T;
  raw: any;
}

export interface EsCollectionResponseInterface<T> {
  entities: T[];
  raw: any;
}
