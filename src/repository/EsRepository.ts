import {
  EsRepositoryInterface,
  EsRequestBulkOptions,
} from './EsRepository.interface';
import { Client } from '@elastic/elasticsearch';
import { EntityTransformer } from '../utils/EntityTransformer';
import { MetaLoader } from '../utils/MetaLoader';
import { ClassType } from '../types/Class.type';

export class EsRepository<Entity = unknown> implements EsRepositoryInterface {
  private readonly metaLoader = new MetaLoader();
  private readonly entityTransformer: EntityTransformer;

  constructor(private readonly client: Client) {
    this.entityTransformer = new EntityTransformer(this.metaLoader);
  }

  async create<Entity>(entity: Entity): Promise<Entity> {
    const dbEntity = this.entityTransformer.normalize(entity);

    await this.client.create({
      index: this.metaLoader.getIndex(entity.constructor as ClassType<Entity>),
      id: dbEntity.id,
      refresh: 'wait_for',
      body: dbEntity.data,
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
