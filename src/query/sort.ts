import { ElasticSearchTypes } from '../types/Es.type';
import { EsFieldType, EsGeoPointType, EsGeoPolygonType } from './common';
import { EsFilter } from './filter';

export type EsOrderAscendingType = 'asc' | 'desc';
export interface EsSortNestedOption<T> {
  path: EsFieldType<T> | string;
  filter?: EsFilter<T>;
  nested?: EsSortNestedOption<T>;
}
export type EsSortTypes<T = unknown> =
  | Array<EsSortTypeScalar>
  | Array<EsSortTypeComplex<T> | EsSortTypeGeoDistance<T>>
  | EsSortTypeScript;
export type EsSortTypeScalar = '_score';
// export type sortTypeComplex<T> = {
//   [field in FieldType<T>]?: sortTypeComplexField<T>;
// };
export type EsSortTypeComplex<T> = Record<
  EsFieldType<T> | '_geo_distance',
  EsSortTypeComplexField<T>
>;
// & sortTypeGeoDistance<T>;
export interface EsSortTypeComplexField<T> {
  order: EsOrderAscendingType;
  format?: 'strict_date_optional_time_nanos' | 'strict_date_optional_time';
  mode?: 'min' | 'max' | 'sum' | 'avg' | 'median';
  numeric_type?: 'double' | 'long' | 'date' | 'date_nanos';
  nested?: EsSortNestedOption<T>;
  missing?: '_last' | '_first';
  unmapped_type?: keyof typeof ElasticSearchTypes;
}
export interface EsSortTypeScript {
  _script: {
    type: 'number';
    script: {
      lang?: 'painless';
      source: string;
      params?: {
        factor: number;
      };
      order: EsOrderAscendingType;
    };
  };
}
export interface EsSortTypeGeoDistance<T> {
  _geo_distance?:
    | Record<EsFieldType<T> | string, EsGeoPolygonType | EsGeoPointType>
    | EsSortTypeComplexField<T>;
}
