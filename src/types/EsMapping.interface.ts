import { DynamicMappingTypes } from './EsClassTypeOptions.interface';

export interface EsMappingInterface {
  dynamic: DynamicMappingTypes;
  properties: Record<string, Record<string, unknown>>;
}
