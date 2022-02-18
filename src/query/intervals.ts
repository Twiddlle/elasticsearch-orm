import { EsIntervalFilter } from './filter';
import { EsFieldType } from './common';

export interface EsQueryIntervalsMatch<T> {
  query: string;
  max_gaps?: number;
  ordered?: boolean;
  analyzer?: string;
  filter?: EsIntervalFilter<T>;
  use_field?: string | EsFieldType<T>;
}

export interface EsQueryIntervalsPrefix<T> {
  prefix: string;
  analyzer?: string;
  use_field?: string | EsFieldType<T>;
}

export interface EsQueryIntervalsWildcard<T> {
  pattern: string;
  analyzer?: string;
  use_field?: string | EsFieldType<T>;
}

export interface EsQueryIntervalsFuzzy<T> {
  term: string;
  prefix_length?: number;
  transpositions?: boolean;
  fuzziness?: string;
  analyzer?: string;
  use_field?: string | EsFieldType<T>;
}

export interface EsQueryIntervalsAllOf<T> {
  intervals: Array<unknown>;
  max_gaps?: number;
  ordered?: boolean;
  filter?: EsIntervalFilter<T>;
}

export interface EsQueryIntervalsAnyOf<T> {
  intervals: Array<unknown>;
  filter?: EsIntervalFilter<T>;
}
