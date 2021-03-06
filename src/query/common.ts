export type EsFieldType<T, U = keyof T> = U | string;
export type EsFieldTypes<T, U = keyof T> = U[] | string[];

export type EsGeoPolygonType = EsGeoPointType[];

export type EsGeoPointType =
  | [number, number]
  | {
      lat: number;
      lon: number;
    }
  | string;

export type EsRewriteTypes =
  | 'constant_score'
  | 'constant_score_boolean'
  | 'scoring_boolean'
  | 'top_terms_blended_freqs_N'
  | 'top_terms_boost_N'
  | 'top_terms_N';

export type EsFormat =
  | 'epoch_millis'
  | 'epoch_second'
  | 'date_optional_time'
  | 'strict_date_optional_time'
  | 'strict_date_optional_time_nanos'
  | 'basic_date'
  | 'basic_date_time'
  | 'basic_date_time_no_millis'
  | 'basic_ordinal_date'
  | 'basic_ordinal_date_time'
  | 'basic_ordinal_date_time_no_millis'
  | 'basic_time'
  | 'basic_time_no_millis'
  | 'basic_t_time'
  | 'basic_t_time_no_millis'
  | 'basic_week_date'
  | 'strict_basic_week_date'
  | 'basic_week_date_time'
  | 'strict_basic_week_date_time'
  | 'basic_week_date_time_no_millis'
  | 'strict_basic_week_date_time_no_millis'
  | 'date'
  | 'strict_date'
  | 'date_hour'
  | 'strict_date_hour'
  | 'date_hour_minute'
  | 'strict_date_hour_minute'
  | 'date_hour_minute_second'
  | 'strict_date_hour_minute_second'
  | 'date_hour_minute_second_fraction'
  | 'strict_date_hour_minute_second_fraction'
  | 'date_hour_minute_second_millis'
  | 'strict_date_hour_minute_second_millis'
  | 'date_time'
  | 'strict_date_time'
  | 'date_time_no_millis'
  | 'strict_date_time_no_millis'
  | 'hour'
  | 'strict_hour'
  | 'hour_minute'
  | 'strict_hour_minute'
  | 'hour_minute_second'
  | 'strict_hour_minute_second'
  | 'hour_minute_second_fraction'
  | 'strict_hour_minute_second_fraction'
  | 'hour_minute_second_millis'
  | 'strict_hour_minute_second_millis'
  | 'ordinal_date'
  | 'strict_ordinal_date'
  | 'ordinal_date_time'
  | 'strict_ordinal_date_time'
  | 'ordinal_date_time_no_millis'
  | 'strict_ordinal_date_time_no_millis'
  | 'time'
  | 'strict_time'
  | 'time_no_millis'
  | 'strict_time_no_millis'
  | 't_time'
  | 'strict_t_time'
  | 't_time_no_millis'
  | 'strict_t_time_no_millis'
  | 'week_date'
  | 'strict_week_date'
  | 'week_date_time'
  | 'strict_week_date_time'
  | 'week_date_time_no_millis'
  | 'strict_week_date_time_no_millis'
  | 'weekyear'
  | 'strict_weekyear'
  | 'weekyear_week'
  | 'strict_weekyear_week'
  | 'weekyear_week_day'
  | 'strict_weekyear_week_day'
  | 'year'
  | 'strict_year'
  | 'year_month'
  | 'strict_year_month'
  | 'year_month_day'
  | 'strict_year_month_day'
  | string;

export type EsFuzzinessType = string | number;
