import { EsMappingInterface } from './EsMapping.interface';

export interface EsIndexInterface {
  aliases: Record<string, Record<string, unknown>>;
  mappings: EsMappingInterface;
  settings?: {
    number_of_shards?: number;
    number_of_replicas?: number;
    [key: string]: unknown;
  };
  analysis?: Record<string, unknown>;
}
