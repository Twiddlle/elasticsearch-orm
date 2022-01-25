import 'reflect-metadata';
import { EsIdOptions, EsProperty } from './EsProperty';

export function EsId(options?: EsIdOptions) {
  return EsProperty(Object.assign({}, options, { type: 'id', isId: true }));
}
