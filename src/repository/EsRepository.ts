import {
  EsRepositoryInterface,
  EsRequestBulkOptions,
  EsSearchOptions,
} from './EsRepository.interface';
import { Client } from '@elastic/elasticsearch';
import { ClassType } from '../types/Class.type';
import { FactoryProvider } from '../factory/Factory.provider';
import { EsIndexInterface } from '../types/EsIndex.interface';
import { EsMappingInterface } from '../types/EsMapping.interface';
import { EsQuery } from '../query/query';
import { EsEntityNotFoundException } from '../exceptions/EsEntityNotFoundException';
import { handleEsException } from '../utils/common';

export class EsRepository<Entity> implements EsRepositoryInterface<Entity> {
  private readonly metaLoader = FactoryProvider.makeMetaLoader();
  private readonly entityTransformer = FactoryProvider.makeEntityTransformer();

  constructor(
    private readonly Entity: ClassType<Entity>,
    private readonly client: Client,
  ) {}

  async create(entity: Entity): Promise<Entity> {
    const dbEntity = this.entityTransformer.normalize(entity);

    await this.client.create({
      index: this.getIndex(entity),
      id: dbEntity.id,
      refresh: this.getRefreshOption(entity),
      body: dbEntity.data,
    });

    return this.findById(dbEntity.id);
  }

  createMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  async delete(entity: Entity): Promise<true> {
    try {
      const dbEntity = this.entityTransformer.normalize(entity);
      await this.client.delete({
        refresh: this.getRefreshOption(entity),
        index: this.getIndex(entity),
        id: dbEntity.id,
      });
      return true;
    } catch (e) {
      handleEsException(e);
    }
  }

  deleteMultiple(requestBulkOptions: EsRequestBulkOptions): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  async find(
    query: EsQuery<Entity>,
    options?: EsSearchOptions<Entity>,
  ): Promise<Entity[]> {
    try {
      const res = await this.client.search({
        index: this.metaLoader.getIndex(this.Entity),
        _source: options?.source as string[],
        body: query,
      });

      const hits = res.body?.hits?.hits || [];

      return hits.map((item) => {
        return this.entityTransformer.denormalize(this.Entity, {
          id: item._id,
          data: item?._source || {},
        });
      });
    } catch (e) {
      handleEsException(e);
    }
  }

  async findById(id: string): Promise<Entity> {
    try {
      const esRes = await this.client.get({
        index: this.metaLoader.getIndex(this.Entity),
        id: id,
      });

      return this.entityTransformer.denormalize(this.Entity, {
        id: esRes.body._id,
        data: esRes.body._source,
      });
    } catch (e) {
      handleEsException(e);
    }
  }

  async findOne(query: EsQuery<Entity>): Promise<Entity> {
    const entities = await this.find({ ...query, size: 1 });
    return entities[0];
  }

  async findOneOrFail(query: EsQuery<Entity>): Promise<Entity> {
    const entity = await this.findOne(query);
    if (!entity) {
      throw new EsEntityNotFoundException();
    }
    return entity;
  }

  async update(entity: Entity): Promise<Entity> {
    try {
      const dbEntity = this.entityTransformer.normalize(entity);

      await this.client.update({
        index: this.getIndex(entity),
        id: dbEntity.id,
        refresh: this.getRefreshOption(entity),
        body: { doc: dbEntity.data },
      });

      return this.findById(dbEntity.id);
    } catch (e) {
      handleEsException(e);
    }
  }

  updateMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  async save(entity: Entity): Promise<Entity> {
    try {
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
    } catch (e) {
      handleEsException(e);
    }
  }

  saveMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]> {
    return Promise.resolve([]);
  }

  async createIndex<Entity>(indexInterface: EsIndexInterface): Promise<void> {
    try {
      await this.client.indices.create({
        index: this.metaLoader.getIndex(this.Entity),
        body: indexInterface,
      });
    } catch (e) {
      handleEsException(e);
    }
  }

  async deleteIndex(): Promise<void> {
    try {
      await this.client.indices.delete({
        index: this.metaLoader.getIndex(this.Entity),
      });
    } catch (e) {
      handleEsException(e);
    }
  }

  async updateMapping(mapping: EsMappingInterface): Promise<void> {
    try {
      await this.client.indices.putMapping({
        index: this.metaLoader.getIndex(this.Entity),
        body: mapping,
      });
    } catch (e) {
      handleEsException(e);
    }
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
