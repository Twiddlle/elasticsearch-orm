import { ElasticSearchTypes } from '../types/Es.type';
import { FieldType, geoPointType, geoPolygonType } from './common';
import { Filter } from './filter';

export type orderAscendingType = 'asc' | 'desc';
export type sortNestedOption<T> = {
  path: FieldType<T> | string;
  filter?: Filter<T>;
  nested?: sortNestedOption<T>;
};
export type sortTypes<T> =
  | Array<sortTypeScalar | sortTypeComplex<T>>
  | sortTypeScript;
// | sortTypeGeoDistance<T>;
export type sortTypeScalar = '_score';
export type sortTypeComplex<T> = Record<FieldType<T>, sortTypeComplexField<T>>;
// & sortTypeGeoDistance<T>;
export type sortTypeComplexField<T> = {
  order: orderAscendingType;
  format?: 'strict_date_optional_time_nanos' | 'strict_date_optional_time';
  mode?: 'min' | 'max' | 'sum' | 'avg' | 'median';
  numeric_type?: 'double' | 'long' | 'date' | 'date_nanos';
  nested?: sortNestedOption<T>;
  missing?: '_last' | '_first';
  unmapped_type?: keyof typeof ElasticSearchTypes;
};
export type sortTypeScript = {
  type: string;
  script: {
    lang?: 'painless';
    source: string;
    params?: {
      factor: number;
    };
    order: orderAscendingType;
  };
};
export type sortTypeGeoDistance<T> = {
  _geo_distance?: Record<FieldType<T>, geoPolygonType | geoPointType> &
    sortTypeComplexField<T>;
};
