import { EsFieldType } from './common';

export type EsTermLevelQueries<T> =
  | EsTermQueryType<T>
  | EsTermQueryTypeShort<T>
  | EsTermsQueryType<T>
  | EsTermsQueryTypeShort<T>
  | EsTermsLookUpQueryType<T>;

export interface EsTermQueryType<T> {
  term: Record<
    EsFieldType<T>,
    {
      value: string | number | boolean;
      boost?: number;
      case_insensitive?: boolean;
    }
  >;
}

export interface EsTermQueryTypeShort<T> {
  term: Record<EsFieldType<T>, string | number | boolean>;
}

export interface EsTermsQueryType<T> {
  terms: Record<
    EsFieldType<T>,
    {
      value: [string | number | boolean];
      boost?: number;
    }
  >;
}

export interface EsTermsQueryTypeShort<T> {
  terms: Record<EsFieldType<T>, [string | number | boolean]>;
}

export interface EsTermsLookUpQueryType<T> {
  terms: Record<
    EsFieldType<T>,
    {
      index: string;
      id: string;
      path: string;
      routing?: string;
    }
  >;
}
