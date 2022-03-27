import { EsIndexInterface } from '../types/EsIndex.interface';
import { EsMappingInterface } from '../types/EsMapping.interface';
import { EsQuery } from '../query/query';
import {
  EsBulkResponseInterface,
  EsCollectionResponseInterface,
  EsDeleteBulkResponseInterface,
  EsResponseInterface,
} from './EsBulkResponseInterface';

export interface EsSearchParams<T, U = keyof T> {
  [key: string]: any;
  source?: U[] | string[] | string;
}

export type EsMiddlewareTypes = 'beforeRequest';

export type EsActionTypes =
  | 'create'
  | 'createMultiple'
  | 'update'
  | 'updateMultiple'
  | 'index'
  | 'indexMultiple'
  | 'delete'
  | 'deleteMultiple'
  | 'find'
  | 'findById'
  | 'createIndex'
  | 'deleteIndex'
  | 'updateMapping';

export type EsMiddlewareFunction = (
  action: EsActionTypes,
  esParams,
  args: any[],
) => void;

export interface EsRepositoryInterface<Entity> {
  create(entity: Entity): Promise<EsResponseInterface<Entity>>;

  createMultiple(entities: Entity[]): Promise<EsBulkResponseInterface<Entity>>;

  update(entity: Entity): Promise<EsResponseInterface<Entity>>;

  updateMultiple(entities: Entity[]): Promise<EsBulkResponseInterface<Entity>>;

  index(entity: Entity): Promise<EsResponseInterface<Entity>>;

  indexMultiple(entities: Entity[]): Promise<EsBulkResponseInterface<Entity>>;

  delete(entity: Entity): Promise<true>;

  deleteMultiple(ids: string[]): Promise<EsDeleteBulkResponseInterface<Entity>>;

  findOne(
    query: EsQuery<Entity>,
  ): Promise<EsResponseInterface<Entity | undefined>>;

  findOneOrFail(query: EsQuery<Entity>): Promise<EsResponseInterface<Entity>>;

  find(
    query: EsQuery<Entity>,
    params?: EsSearchParams<Entity>,
  ): Promise<EsCollectionResponseInterface<Entity>>;

  findById(id: string): Promise<EsResponseInterface<Entity>>;

  createIndex(indexInterface: EsIndexInterface): Promise<void>;

  deleteIndex(): Promise<void>;

  updateMapping(mapping: EsMappingInterface): Promise<void>;
}
