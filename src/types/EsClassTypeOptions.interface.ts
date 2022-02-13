import { EsPropsMetaDataInterface } from './EsMetaData.interface';

export type DynamicMappingTypes = 'true' | 'runtime' | 'false' | 'strict';

export type namingStrategyFunction = (prop: EsPropsMetaDataInterface) => string;

export interface EsClassTypeOptionsInterface {
  aliases?: string[];
  name?: string;
  namingStrategy?: namingStrategyFunction;
  mapping?: {
    dynamic?: DynamicMappingTypes;
  };
  options?: {
    refresh?: 'wait_for' | boolean;
  };
  settings?: {
    number_of_shards?: number;
    number_of_replicas?: number;
    [key: string]: unknown;
  };
}

export interface ESClassFullTypeOptionsInterface
  extends EsClassTypeOptionsInterface {
  index: string;
}
