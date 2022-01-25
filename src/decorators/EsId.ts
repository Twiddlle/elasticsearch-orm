import 'reflect-metadata';
import { EsIdOptions } from '../types/EsPropertyOptions.intarface';
import { EsProperty } from './EsProperty';

export function EsId(options?: EsIdOptions) {
  return EsProperty(Object.assign({}, options, { type: 'id', isId: true }));
}
