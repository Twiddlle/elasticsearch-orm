import { EsFieldPropertyOptions } from './EsFieldPropertyOptions.interface';
import { EsType } from './Es.type';
import { ClassType } from './Class.type';

export type idGenerator = (entity) => string;

export interface EsPropertyOptions {
  additionalFieldOptions?: EsFieldPropertyOptions;
  isId?: boolean;
}

export interface EsNestedTypedOptions {
  type: 'nested';
  entity: ClassType<unknown>;
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

export type EsComposedPropertyOptions = EsPropertyFullOptions &
  EsNestedTypedOptions &
  EsIdOptions;
