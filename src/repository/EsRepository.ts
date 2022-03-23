import {
  EsRepositoryInterface,
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
import { EsException } from '../exceptions/EsException';
import { EsTermIdsQueryType } from '../query/termQueries';
import {
  EsBulkResponseInterface,
  EsDeleteBulkResponseInterface,
} from './EsBulkResponse.interface';

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

  async createMultiple(
    entities: Entity[],
  ): Promise<EsBulkResponseInterface<Entity>> {
    return this.makeBulkRequest(entities, 'create');
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

  async deleteMultiple(
    ids: string[],
  ): Promise<EsDeleteBulkResponseInterface<Entity>> {
    const bulkRequestBody = [];
    const index = this.metaLoader.getIndex(this.Entity);

    try {
      for (const id of ids) {
        bulkRequestBody.push({
          delete: {
            _index: index,
            _id: id,
          },
        });
      }

      const bulkRes = await this.client.bulk({
        refresh: true,
        body: bulkRequestBody,
      });

      return {
        rawRes: bulkRes,
        hasErrors: !!bulkRes.body.errors,
      };
    } catch (e) {
      handleEsException(e);
    }
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

  updateMultiple(entities: Entity[]): Promise<EsBulkResponseInterface<Entity>> {
    return this.makeBulkRequest(entities, 'update');
  }

  async index(entity: Entity): Promise<Entity> {
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

  indexMultiple(entities: Entity[]): Promise<EsBulkResponseInterface<Entity>> {
    return this.makeBulkRequest(entities, 'index');
  }

  async createIndex(indexInterface: EsIndexInterface): Promise<void> {
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

  private async makeBulkRequest(
    entities: Entity[],
    type: 'create' | 'index' | 'update',
  ): Promise<EsBulkResponseInterface<Entity>> {
    const bulkRequestBody = [];
    const indices = new Set();

    const query: EsQuery<Entity> = {
      query: {
        ids: {
          values: [],
        },
      },
    };

    try {
      for (const entity of entities) {
        const index = this.getIndex(entity);
        indices.add(index);
        const dbEntity = this.entityTransformer.normalize(entity);
        (query.query as EsTermIdsQueryType).ids.values.push(dbEntity.id);
        bulkRequestBody.push({
          [type]: {
            _index: index,
            _id: dbEntity.id,
          },
        });
        bulkRequestBody.push(
          type === 'update' ? { doc: dbEntity.data } : dbEntity.data,
        );
      }

      if (indices.size > 1) {
        throw new EsException(
          'Bulk requests with multiple indices are not supported yet',
        );
      }

      const bulkRes = await this.client.bulk({
        refresh: true,
        body: bulkRequestBody,
      });

      query.size = (query.query as EsTermIdsQueryType).ids.values.length;
      return {
        items: await this.find(query),
        rawRes: bulkRes,
        hasErrors: !!bulkRes.body.errors,
      };
    } catch (e) {
      handleEsException(e);
    }
  }
}
