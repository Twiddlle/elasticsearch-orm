import { EsFulltextQueries } from './fulltextQueries';
import { EsSortTypes } from './sort';
import { EsSourceTypes } from './source';
import { EsQueryFieldsTypes } from './fields';
import { EsTermLevelQueries } from './termQueries';
import { EsGeoQueries } from './geoQueries';
import { EsFilter } from './filter';
import { EsSuggestion } from './suggestion';
import { EsCollapseType } from './collapse';
import { EsReScoreType } from './rescore';
import { EsHighlightsType } from './highlights';

export type EsQueryObject<T> =
  | EsFulltextQueries<T>
  | EsTermLevelQueries<T>
  | EsGeoQueries<T>;

export interface EsBoolQuery<T> {
  bool: Partial<
    Record<'must' | 'must_not' | 'should' | 'filter', Array<EsQueryObject<T>>>
  >;
}

export interface EsQueryMatchAll {
  match_all: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type EsQuery<T = unknown> = EsQueryInterface<T> | Function;

export interface EsQueryInterface<T = unknown> {
  query: EsBoolQuery<T> | EsQueryObject<T> | EsQueryMatchAll;
  size?: number;
  from?: number;
  sort?: EsSortTypes<T>;
  _source?: EsSourceTypes<T>;
  fields?: EsQueryFieldsTypes<T>;
  aggs?: {
    [name: string]: {
      [type: string]: Record<string, any>;
    };
  };
  profile?: boolean;
  track_scores?: boolean;
  pit?: {
    id: string;
    keep_alive: 'string';
  };
  search_after?: string[];
  post_filter?: EsFilter<T>;
  suggest?: EsSuggestion<T>;
  collapse?: EsCollapseType<T>;
  indices_boost?: Array<Record<string, number>>;
  rescore?: EsReScoreType | EsReScoreType[];
  script_fields?: {
    [field: string]: {
      script: string;
    };
  };
  runtime_mappings?: {
    [key: string]: {
      type: string;
    };
  };
  highlight?: EsHighlightsType<T>;
  explain?: boolean;
  stats?: any;
  timeout?: '10s' | '20s' | '30s' | string;
  wait_for_completion?: boolean;
  version?: boolean;
  track_total_hits?: boolean;
  [key: string]: any;
}
