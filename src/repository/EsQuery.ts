export type EsQueryFields<T, U = keyof T> = U[] | string[];

export interface EsQuery<T = unknown> {
  fields?: EsQueryFields<T>;
}
