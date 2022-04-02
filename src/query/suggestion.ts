import { EsFieldType } from './common';

export type EsSuggestion<T> = Record<string, EsSuggestionParams<T>>;

export interface EsSuggestionParams<T> {
  text: string;
  term: {
    field: EsFieldType<T>;
    analyzer?: string;
    size?: number;
    sort?: 'score' | 'frequency';
    suggest_mode?: 'missing' | 'popular' | 'always';
    max_edits?: number;
    prefix_length?: number;
    min_word_length?: number;
    shard_size?: number;
    max_inspections?: number;
    min_doc_freq?: number;
    max_term_freq?: number | string;
    string_distance?:
      | 'internal'
      | 'damerau_levenshtein'
      | 'levenshtein'
      | 'jaro_winkler'
      | 'ngram';
  };
}
