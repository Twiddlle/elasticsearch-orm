import {
  EsFieldType,
  EsFieldTypes,
  EsFormat,
  EsFuzzinessType,
  EsRewriteTypes,
} from './common';

export type EsTermLevelQueries<T> =
  | EsTermExistsQueryType<T>
  | EsTermFuzzyQueryTypeShort<T>
  | EsTermFuzzyQueryType<T>
  | EsTermIdsQueryType
  | EsTermPrefixQueryType<T>
  | EsTermPrefixQueryTypeShort<T>
  | EsTermRangeQueryType<T>
  | EsTermRegExpQueryType<T>
  | EsTermRegExpQueryTypeShort<T>
  | EsTermQueryType<T>
  | EsTermQueryTypeShort<T>
  | EsTermsQueryType<T>
  | EsTermsQueryTypeShort<T>
  | EsTermsLookUpQueryType<T>
  | EsTermsSetQueryType<T>
  | EsTermsWildCardQueryType<T>
  | EsTermsWildCardQueryTypeShort<T>;

export interface EsTermExistsQueryType<T> {
  exists: {
    field: EsFieldType<T>;
  };
}

export interface EsTermFuzzyQueryTypeShort<T> {
  fuzzy: Record<EsFieldType<T>, string>;
}

export interface EsTermFuzzyQueryType<T> {
  fuzzy: Record<
    EsFieldType<T>,
    {
      value: string;
      fuzziness?: EsFuzzinessType;
      max_expansions?: number;
      prefix_length?: number;
      transpositions?: boolean;
      rewrite?: EsRewriteTypes;
    }
  >;
}

export interface EsTermIdsQueryType {
  ids: {
    values: string[];
  };
}

export interface EsTermPrefixQueryType<T> {
  prefix: Record<
    EsFieldType<T>,
    {
      value: string;
      rewrite?: EsRewriteTypes;
      case_insensitive?: boolean;
    }
  >;
}

export interface EsTermPrefixQueryTypeShort<T> {
  prefix: Record<EsFieldType<T>, string>;
}

export interface EsTermRangeQueryType<T> {
  range: Record<
    EsFieldType<T>,
    {
      gte?: number | string | Date;
      ge?: number | string | Date;
      lte?: number | string | Date;
      lt?: number | string | Date;
      format?: EsFormat;
      relation?: 'INTERSECTS' | 'CONTAINS' | 'WITHIN';
      time_zone?: string;
      boost?: number;
    }
  >;
}

export interface EsTermRegExpQueryType<T> {
  regexp: Record<
    EsFieldType<T>,
    {
      value: string;
      flags?: 'ALL' | string;
      case_insensitive?: boolean;
      max_determinized_states?: number;
      rewrite?: EsRewriteTypes;
    }
  >;
}

export interface EsTermRegExpQueryTypeShort<T> {
  regexp: Record<EsFieldType<T>, string>;
}

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

export interface EsTermsSetQueryType<T> {
  terms_set: Record<
    EsFieldType<T>,
    {
      terms: EsFieldTypes<T>;
      minimum_should_match_field?: number | EsFieldType<T>;
      minimum_should_match_script?: {
        source: string;
      };
      boost?: number;
    }
  >;
}

export interface EsTermsWildCardQueryType<T> {
  wildcard: Record<
    EsFieldType<T>,
    {
      boost?: number;
      case_insensitive?: boolean;
      rewrite?: string;
      value: EsFieldTypes<T>;
    }
  >;
}

export interface EsTermsWildCardQueryTypeShort<T> {
  wildcard: Record<EsFieldType<T>, string>;
}
