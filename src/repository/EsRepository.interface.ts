import { EsIndexInterface } from '../types/EsIndex.interface';
import { EsMappingInterface } from '../types/EsMapping.interface';

export interface EsRequestBulkOptions {
  throwException?: true;
}

export interface EsSearchOptions<T, U = keyof T> {
  source?: U[] | string[];
}

export interface EsRepositoryInterface<Entity = unknown> {
  create(entity: Entity): Promise<Entity>;

  createMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]>;

  update(entity: Entity): Promise<Entity>;

  updateMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]>;

  save(entity: Entity): Promise<Entity>;

  saveMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]>;

  delete(entity: Entity): Promise<true>;

  deleteMultiple(requestBulkOptions: EsRequestBulkOptions): Promise<Entity>;

  findOne(query): Promise<Entity>;

  findOneOrFail(query): Promise<Entity>;

  find(
    query,
    limit?: number,
    offset?: number,
    options?: EsSearchOptions<Entity>,
  ): Promise<Entity[]>;

  findById(id: string): Promise<Entity>;

  createIndex(indexInterface: EsIndexInterface): Promise<void>;

  deleteIndex(): Promise<void>;

  updateMapping(mapping: EsMappingInterface): Promise<void>;
}
