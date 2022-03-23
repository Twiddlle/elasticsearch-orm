import { EsIndexInterface } from '../types/EsIndex.interface';
import { EsMappingInterface } from '../types/EsMapping.interface';
import { EsQuery } from '../query/query';
import {
  EsBulkResponseInterface,
  EsDeleteBulkResponseInterface,
} from './EsBulkResponse.interface';

export interface EsRequestBulkOptions {
  throwException?: true;
}

export interface EsSearchOptions<T, U = keyof T> {
  source?: U[] | string[];
}

export interface EsRepositoryInterface<Entity> {
  create(entity: Entity): Promise<Entity>;

  createMultiple(entities: Entity[]): Promise<EsBulkResponseInterface<Entity>>;

  update(entity: Entity): Promise<Entity>;

  updateMultiple(entities: Entity[]): Promise<EsBulkResponseInterface<Entity>>;

  index(entity: Entity): Promise<Entity>;

  indexMultiple(entities: Entity[]): Promise<EsBulkResponseInterface<Entity>>;

  delete(entity: Entity): Promise<true>;

  deleteMultiple(ids: string[]): Promise<EsDeleteBulkResponseInterface<Entity>>;

  findOne(query: EsQuery<Entity>): Promise<Entity | undefined>;

  findOneOrFail(query: EsQuery<Entity>): Promise<Entity>;

  find(
    query: EsQuery<Entity>,
    options?: EsSearchOptions<Entity>,
  ): Promise<Entity[]>;

  findById(id: string): Promise<Entity>;

  createIndex(indexInterface: EsIndexInterface): Promise<void>;

  deleteIndex(): Promise<void>;

  updateMapping(mapping: EsMappingInterface): Promise<void>;
}
