import 'reflect-metadata';
import { EsProperty, EsPropertyOptions } from './EsProperty';

export function EsId(options?: EsPropertyOptions) {
  return EsProperty(Object.assign({}, options, { type: 'id', isId: true }));
}
