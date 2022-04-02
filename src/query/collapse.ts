import { EsFieldType } from './common';

export interface EsCollapseType<T> {
  field: EsFieldType<T>;
  inner_hits?: EsCollapseInnerHitsType<T> | Array<EsCollapseInnerHitsType<T>>;
}

export interface EsCollapseInnerHitsType<T> {
  [key: string]: any;
  name?: string;
  collapse?: { field: EsFieldType<T> };
  size?: number;
}
