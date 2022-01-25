import { EsIndexInterface } from '../types/EsIndex.interface';
import { EsMappingInterface } from '../types/EsMapping.interface';
import { ClassType } from '../types/Class.type';

export interface EsRequestBulkOptions {
  throwException?: true;
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

  delete(entity: Entity): Promise<boolean>;

  deleteMultiple(
    entity: Entity,
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity>;

  findOne(query): Promise<Entity>;

  findOneOrFail(query): Promise<Entity>;

  find(query): Promise<Entity[]>;

  findById(id: string, Entity: ClassType<Entity>): Promise<Entity>;

  createIndex(
    Entity: ClassType<Entity>,
    indexInterface: EsIndexInterface,
  ): Promise<void>;

  deleteIndex(Entity: ClassType<Entity>): Promise<void>;

  updateMapping(
    Entity: ClassType<Entity>,
    mapping: EsMappingInterface,
  ): Promise<void>;
}
