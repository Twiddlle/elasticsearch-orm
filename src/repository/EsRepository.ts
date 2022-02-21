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
    const dbEntity = this.entityTransformer.normalize(entity);
    await this.client.delete({
      refresh: this.getRefreshOption(entity),
      index: this.getIndex(entity),
      id: dbEntity.id,
    });
    return true;
  }

  deleteMultiple(requestBulkOptions: EsRequestBulkOptions): Promise<Entity> {
    return Promise.resolve(undefined);
  }

  async find(
    query: EsQuery<Entity>,
    options?: EsSearchOptions<Entity>,
  ): Promise<Entity[]> {
    const res = await this.client.search({
      index: this.metaLoader.getIndex(this.Entity),
      _source: options?.source as string[],
      body: query,
    });

    console.log(123);

    const hits = res.body?.hits?.hits || [];

    return hits.map((item) => {
      return this.entityTransformer.denormalize(this.Entity, {
        id: item._id,
        data: item?._source || {},
      });
    });
  }

  async findById(id: string): Promise<Entity> {
    const esRes = await this.client.get({
      index: this.metaLoader.getIndex(this.Entity),
      id: id,
    });

    return this.entityTransformer.denormalize(this.Entity, {
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

    return this.findById(dbEntity.id);
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

  async createIndex<Entity>(indexInterface: EsIndexInterface): Promise<void> {
    await this.client.indices.create({
      index: this.metaLoader.getIndex(this.Entity),
      body: indexInterface,
    });
  }

  async deleteIndex(): Promise<void> {
    await this.client.indices.delete({
      index: this.metaLoader.getIndex(this.Entity),
    });
  }

  async updateMapping(mapping: EsMappingInterface): Promise<void> {
    await this.client.indices.putMapping({
      index: this.metaLoader.getIndex(this.Entity),
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
