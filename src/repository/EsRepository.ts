import {
  EsRepositoryInterface,
  EsRequestBulkOptions,
} from './EsRepository.interface';
import { Client } from '@elastic/elasticsearch';
import { ClassType } from '../types/Class.type';
import { FactoryProvider } from '../factory/Factory.provider';
import { EsIndexInterface } from '../types/EsIndex.interface';
import { EsMappingInterface } from '../types/EsMapping.interface';

export class EsRepository<Entity = unknown> implements EsRepositoryInterface {
  private readonly metaLoader = FactoryProvider.makeMetaLoader();
  private readonly entityTransformer = FactoryProvider.makeEntityTransformer();

  constructor(private readonly client: Client) {}

  async create(entity: Entity): Promise<Entity> {
    const dbEntity = this.entityTransformer.normalize(entity);

    await this.client.create({
      index: this.getIndex(entity),
      id: dbEntity.id,
      refresh: this.getRefreshOption(entity),
      body: dbEntity.data,
    });

    return this.findById(dbEntity.id, entity.constructor as ClassType<Entity>);
  }

  createMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  async delete(entity: Entity): Promise<true> {
    const dbEntity = this.entityTransformer.normalize(entity);
    await this.client.delete({
      refresh: this.getRefreshOption(entity),
      index: this.getIndex(entity),
      id: dbEntity.id,
    });
    return true;
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

  async findById(id: string, Entity: ClassType<Entity>): Promise<Entity> {
    const esRes = await this.client.get({
      index: this.metaLoader.getIndex(Entity),
      id: id,
    });

    return this.entityTransformer.denormalize(Entity, {
      id: esRes.body._id,
      data: esRes.body._source,
    });
  }

  findOne(query): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  findOneOrFail(query): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  async update(entity: Entity): Promise<Entity> {
    const dbEntity = this.entityTransformer.normalize(entity);

    await this.client.update({
      index: this.getIndex(entity),
      id: dbEntity.id,
      refresh: this.getRefreshOption(entity),
      body: { doc: dbEntity.data },
    });

    return this.findById(dbEntity.id, entity.constructor as ClassType<Entity>);
  }

  updateMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  async save(entity: Entity): Promise<Entity> {
    const dbEntity = this.entityTransformer.normalize(entity);
    await this.client.index({
      index: this.getIndex(entity),
      id: dbEntity.id,
      refresh: this.getRefreshOption(entity),
      body: dbEntity.data,
    });
    return this.entityTransformer.denormalize(
      entity.constructor as ClassType<Entity>,
      dbEntity,
    );
  }

  saveMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  async createIndex<Entity>(
    Entity: ClassType<Entity>,
    indexInterface: EsIndexInterface,
  ): Promise<void> {
    await this.client.indices.create({
      index: this.metaLoader.getIndex(Entity),
      body: indexInterface,
    });
  }

  async deleteIndex(Entity: ClassType<Entity>): Promise<void> {
    await this.client.indices.delete({
      index: this.metaLoader.getIndex(Entity),
    });
  }

  async updateMapping(
    Entity: ClassType<Entity>,
    mapping: EsMappingInterface,
  ): Promise<void> {
    await this.client.indices.putMapping({
      index: this.metaLoader.getIndex(Entity),
      body: mapping,
    });
  }

  private getIndex<Entity>(entity: Entity) {
    return this.metaLoader.getIndex(entity.constructor as ClassType<Entity>);
  }

  private getRefreshOption<Entity>(entity: Entity) {
    return this.metaLoader.getReflectMetaData(
      entity.constructor as ClassType<Entity>,
    ).entity.options.refresh;
  }
}
