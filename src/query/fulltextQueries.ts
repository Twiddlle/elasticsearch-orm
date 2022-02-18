import { EsFieldType, EsFieldTypes } from './common';
import {
  EsQueryIntervalsAllOf,
  EsQueryIntervalsAnyOf,
  EsQueryIntervalsFuzzy,
  EsQueryIntervalsMatch,
  EsQueryIntervalsPrefix,
  EsQueryIntervalsWildcard,
} from './intervals';
import { EsFuzziness } from './query';

export interface EsFulltextQueryIntervals<T> {
  intervals: Record<
    EsFieldType<T>,
    | Record<'match', EsQueryIntervalsMatch<T>>
    | Record<'prefix', EsQueryIntervalsPrefix<T>>
    | Record<'wildcard', EsQueryIntervalsWildcard<T>>
    | Record<'fuzzy', EsQueryIntervalsFuzzy<T>>
    | Record<'all_of', EsQueryIntervalsAllOf<T>>
    | Record<'any_of', EsQueryIntervalsAnyOf<T>>
  >;
}

export interface EsFulltextQueryMatchShort<T> {
  match: Record<EsFieldType<T>, string>;
}
export interface EsFulltextQueryMatch<T> {
  match: Record<
    EsFieldType<T>,
    {
      query: string;
      analyzer?: string;
      auto_generate_synonyms_phrase_query?: boolean;
      fuzziness?: EsFuzziness;
      max_expansions?: number;
      prefix_length?: number;
      fuzzy_transpositions?: boolean;
      fuzzy_rewrite?:
        | 'constant_score'
        | 'constant_score_boolean'
        | 'scoring_boolean'
        | 'top_terms_blended_freqs_N'
        | 'top_terms_boost_N'
        | 'top_terms_N';
      lenient?: boolean;
      operator?: 'or' | 'and';
      minimum_should_match?: string;
      zero_terms_query?: 'none' | 'all';
    }
  >;
}

export interface EsFulltextQueryMatchBooleanPrefix<T> {
  match_bool_prefix: Record<
    EsFieldType<T>,
    {
      query: string;
      analyzer?: string;
      operator?: 'or' | 'and';
      minimum_should_match?: string;
    }
  >;
}

export interface EsFulltextQueryMatchBooleanPrefixShort<T> {
  match_bool_prefix: Record<EsFieldType<T>, string>;
}

export interface EsFulltextQueryMatchPhraseQuery<T> {
  match_phrase: Record<
    EsFieldType<T>,
    {
      query: string;
      analyzer?: string;
      zero_terms_query?: 'none' | 'all';
    }
  >;
}

export interface EsFulltextQueryMatchPhraseQueryShort<T> {
  match_phrase: Record<EsFieldType<T>, string>;
}

export interface EsFulltextQueryMatchPhraseQueryPrefix<T> {
  match_phrase_prefix: Record<
    EsFieldType<T>,
    {
      query: string;
      analyzer?: string;
      max_expansions?: number;
      slop?: number;
      zero_terms_query?: 'none' | 'all';
    }
  >;
}

export interface EsFulltextQueryMatchPhraseQueryPrefixShort<T> {
  match_phrase_prefix: Record<EsFieldType<T>, string>;
}

export interface EsFulltextQueryCombinedFields<T> {
  combined_fields: {
    fields: EsFieldTypes<T>;
    query: string;
    auto_generate_synonyms_phrase_query: boolean;
    operator?: 'or' | 'and';
    minimum_should_match?: string;
    zero_terms_query?: 'none' | 'all';
  };
}

export interface EsFulltextQueryMultiMatchFields<T> {
  multi_match: {
    query: 'string';
    type:
      | 'best_fields'
      | 'most_fields'
      | 'cross_fields'
      | 'phrase'
      | 'phrase_prefix'
      | 'bool_prefix';
    fields: EsFieldTypes<T>;
    analyzer?: string;
    boost?: number;
    tie_breaker?: number;
    auto_generate_synonyms_phrase_query?: boolean;
    fuzziness?: EsFuzziness;
    max_expansions?: number;
    prefix_length?: number;
    fuzzy_transpositions?: boolean;
    fuzzy_rewrite?:
      | 'constant_score'
      | 'constant_score_boolean'
      | 'scoring_boolean'
      | 'top_terms_blended_freqs_N'
      | 'top_terms_boost_N'
      | 'top_terms_N';
    lenient?: boolean;
    operator?: 'or' | 'and';
    minimum_should_match?: string;
    zero_terms_query?: 'none' | 'all';
  };
}

export interface EsFulltextQueryString<T> {
  query_string: {
    query: 'string';
    default_field?: EsFieldType<T>;
    allow_leading_wildcard?: boolean;
    analyze_wildcard?: boolean;
    analyzer?: string;
    auto_generate_synonyms_phrase_query?: boolean;
    boost?: number;
    default_operator?: 'or' | 'and';
    enable_position_increments?: boolean;
    fields?: EsFieldTypes<T>;
    fuzziness?: EsFuzziness;
    fuzzy_max_expansions?: number;
    fuzzy_prefix_length?: number;
    fuzzy_transpositions?: boolean;
    lenient?: boolean;
    max_determinized_states?: number;
    minimum_should_match?: string;
    quote_analyzer?: string;
    phrase_slop?: number;
    quote_field_suffix?: string;
    rewrite?: string;
    time_zone?: string;
  };
}

export interface EsFulltextSimpleQueryString<T> {
  simple_query_string: {
    query: 'string';
    fields?: EsFieldType<T>;
    default_operator?: 'or' | 'and';
    analyze_wildcard?: boolean;
    analyzer?: string;
    auto_generate_synonyms_phrase_query?: boolean;
    flags?: string;
    fuzzy_max_expansions?: number;
    fuzzy_prefix_length?: number;
    fuzzy_transpositions?: boolean;
    lenient?: boolean;
    minimum_should_match?: string;
    quote_field_suffix?: string;
  };
}
