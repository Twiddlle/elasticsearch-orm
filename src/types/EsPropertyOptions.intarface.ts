import { EsFieldPropertyOptions } from './EsFieldPropertyOptions.interface';
import { EsType } from './Es.type';

export type idGenerator = (entity) => string;

export interface EsPropertyOptions {
  fieldOptions?: EsFieldPropertyOptions;
  name?: string;
  isId?: boolean;
}

export interface EsIdOptions extends EsPropertyOptions {
  generator?: idGenerator;
}

export interface EsPropertyTypedOptions extends EsPropertyOptions {
  type: EsType;
}

export interface EsPropertyFullOptions extends EsPropertyTypedOptions {
  entityPropName: string;
}
