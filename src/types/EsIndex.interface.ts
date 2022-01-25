import { EsMappingInterface } from './EsMapping.interface';

export interface EsIndexInterface {
  mappings: EsMappingInterface;
  settings?: {
    number_of_shards?: number;
    number_of_replicas?: number;
  };
  analysis?: Record<string, unknown>;
}
