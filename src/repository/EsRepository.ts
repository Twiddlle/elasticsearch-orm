import {
  EsRepositoryInterface,
  EsRequestBulkOptions,
} from './EsRepository.interface';
import { Client } from '@elastic/elasticsearch';
import { ClassType } from '../types/Class.type';
import { FactoryProvider } from '../factory/Factory.provider';

export class EsRepository<Entity = unknown> implements EsRepositoryInterface {
  private readonly metaLoader = FactoryProvider.makeMetaLoader();
  private readonly entityTransformer = FactoryProvider.makeEntityTransformer();

  constructor(private readonly client: Client) {}

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

  update(entity: Entity): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  updateMultiple(
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
