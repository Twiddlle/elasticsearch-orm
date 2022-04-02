import { EsFieldType } from './common';

export interface EsHighlightOptions {
  boundary_chars?: string;
  boundary_max_scan?: number;
  boundary_scanner?: any;
  boundary_scanner_locale?: string;
  encoder?: 'default' | 'html';
  force_source?: boolean;
  fragmenter?: 'simple' | 'span';
  fragment_offset?: number;
  fragment_size?: number;
  matched_fields?: any;
  no_match_size?: number;
  number_of_fragments?: number;
  order?: 'score' | 'none';
  phrase_limit?: number;
  pre_tags?: string[];
  post_tags?: string[];
  require_field_match?: boolean;
  max_analyzed_offset?: number;
  tags_schema?: 'styled';
  type?: 'unified' | 'plain' | 'fvh';
}

export interface EsHighlightsType<T> extends EsHighlightOptions {
  fields: Record<EsFieldType<T>, EsHighlightOptions>;
}
