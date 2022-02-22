import { EsFieldType, EsFormat } from './common';

export type EsQueryFieldsTypes<T = unknown> = Array<
  EsQueryFieldsTypeFormat<T> | EsFieldType<T> | '*' | string
>;

export interface EsQueryFieldsTypeFormat<T> {
  field: EsFieldType<T>;
  format: EsFormat;
}
