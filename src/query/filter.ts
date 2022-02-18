import { EsQueryObject } from './query';

export interface EsFilter<T> {
  [key: string]: any;
}

export interface EsScriptFilter<T> {
  [key: string]: any;
}

export type EsIntervalFilter<T> =
  | Record<
      | 'after'
      | 'before'
      | 'contained_by'
      | 'containing'
      | 'not_contained_by'
      | 'not_containing'
      | 'not_overlapping'
      | 'overlapping',
      EsQueryObject<T>
    >
  | Record<'script', EsScriptFilter<T>>;
