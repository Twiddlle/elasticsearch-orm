export type DynamicMappingTypes = 'true' | 'runtime' | 'false' | 'strict';

export interface EsClassTypeOptionsInterface {
  aliases?: string[];
  name?: string;
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
