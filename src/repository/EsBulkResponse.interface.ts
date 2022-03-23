export interface EsBulkResponseInterface<T> {
  items: T[];
  rawRes: any;
  hasErrors: boolean;
}

export interface EsDeleteBulkResponseInterface<T> {
  rawRes: any;
  hasErrors: boolean;
}
