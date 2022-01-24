import {
  EsRepositoryInterface,
  EsRequestBulkOptions,
} from './EsRepository.interface';
import { Client } from '@elastic/elasticsearch';
import { EntityTransformer } from '../utils/EntityTransformer';
import { MetaLoader } from '../utils/MetaLoader';
import { ClassType } from '../types/Class.type';

export class EsRepository<Entity = unknown> implements EsRepositoryInterface {
  private readonly entityTransformer: EntityTransformer;
  private readonly metaLoader: MetaLoader;

  constructor(private readonly client: Client) {}

  async create(entity: Entity): Promise<Entity> {
    const dbEntity = this.entityTransformer.normalize(entity);
    const dbEntityId = dbEntity[
      this.metaLoader.getIdPropName(entity.constructor as ClassType<Entity>)
    ] as undefined | string;

    await this.client.create({
      index: this.metaLoader.getIndex(entity.constructor as ClassType<Entity>),
      id: dbEntityId,
      refresh: 'wait_for',
      body: dbEntity,
    });

    return this.entityTransformer.denormalize<Entity>(
      entity.constructor as ClassType<Entity>,
      dbEntity,
    );
  }

  createMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  delete(id: string[]): Promise<boolean> {
    return Promise.resolve(false);
  }

  deleteMultiple(
    entity: Entity,
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  find(query): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  findById(id: string | number): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  findOne(query): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  findOneOrFail(query): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  index(entity: Entity): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  indexMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  save(entity: Entity): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  saveMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]> {
    return Promise.resolve([]);
  }
}
