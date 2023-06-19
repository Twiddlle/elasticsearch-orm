import {
  EsRepositoryInterface,
  EsMiddlewareTypes,
  EsMiddlewareFunction,
  EsActionTypes,
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
  EsCollectionResponseInterface,
  EsDeleteBulkResponseInterface,
  EsResponseInterface,
} from './EsBulkResponseInterface';
import { TransportRequestOptions } from '@elastic/transport';
import {
  DeleteByQueryRequest,
  SearchRequest,
} from '@elastic/elasticsearch/lib/api/types';

export class EsRepository<Entity> implements EsRepositoryInterface<Entity> {
  private readonly metaLoader = FactoryProvider.makeMetaLoader();
  private readonly entityTransformer = FactoryProvider.makeEntityTransformer();
  private readonly registeredMiddlewares: Record<
    EsMiddlewareTypes,
    EsMiddlewareFunction[]
  > = {
    beforeRequest: [],
  };

  constructor(
    private readonly Entity: ClassType<Entity>,
    private readonly client: Client,
  ) {}

  public on(actionType: EsMiddlewareTypes, fn: EsMiddlewareFunction) {
    this.registeredMiddlewares[actionType].push(fn);
  }

  private triggerBeforeRequest(
    actionType: EsActionTypes,
    esParams: any,
    args: any[],
  ) {
    for (const fn of this.registeredMiddlewares.beforeRequest) {
      esParams = fn(actionType, esParams, args);
    }
    return esParams;
  }

  async create(
    entity: Entity,
    params: Partial<TransportRequestOptions> = {},
  ): Promise<EsResponseInterface<Entity>> {
    const dbEntity = this.entityTransformer.normalize(entity);

    const esParams = Object.assign(
      {
        index: this.getIndex(entity),
        id: dbEntity.id,
        refresh: this.getRefreshOption(entity),
        body: dbEntity.data,
      },
      params,
    );
    this.triggerBeforeRequest('create', esParams, [entity]);

    const esRes = await this.client.create(esParams);

    const found = await this.findById(dbEntity.id);
    return {
      entity: found.entity,
      raw: esRes,
    };
  }

  async createMultiple(
    entities: Entity[],
    params: Partial<TransportRequestOptions> = {},
  ): Promise<EsBulkResponseInterface<Entity>> {
    return this.makeBulkRequest(entities, 'create', params);
  }

  async delete(
    entity: Entity,
    params: Partial<TransportRequestOptions> = {},
  ): Promise<true> {
    try {
      const dbEntity = this.entityTransformer.normalize(entity);
      const esParams = Object.assign(
        {
          refresh: this.getRefreshOption(entity),
          index: this.getIndex(entity),
          id: dbEntity.id,
        },
        params,
      );

      this.triggerBeforeRequest('delete', esParams, [entity]);
      await this.client.delete(esParams);
      return true;
    } catch (e) {
      handleEsException(e);
    }
  }

  async deleteMultiple(
    ids: string[],
    params: Partial<TransportRequestOptions> = {},
  ): Promise<EsDeleteBulkResponseInterface> {
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

      const esBulkParams = Object.assign(
        {
          refresh: true,
          body: bulkRequestBody,
        },
        params,
      );

      this.triggerBeforeRequest('deleteMultiple', esBulkParams, [ids]);

      const bulkRes = await this.client.bulk(esBulkParams);

      return {
        raw: bulkRes,
        hasErrors: !!bulkRes.errors,
      };
    } catch (e) {
      handleEsException(e);
    }
  }

  async deleteByQuery(query: EsQuery<Entity>) {
    try {
      const esParams: DeleteByQueryRequest = Object.assign({
        index: this.metaLoader.getIndex(this.Entity, query as any),
        body: query,
      });

      this.triggerBeforeRequest('deleteByQuery', esParams, [query]);
      const res = await this.client.deleteByQuery(esParams);

      return { deleted: res?.deleted, raw: res };
    } catch (e) {
      handleEsException(e);
    }
  }

  async find(
    query: EsQuery<Entity>,
    params: Partial<SearchRequest> = {},
  ): Promise<EsCollectionResponseInterface<Entity>> {
    try {
      const esParams: SearchRequest = Object.assign(
        {
          index: this.metaLoader.getIndex(this.Entity, query as any),
          body: query,
        },
        params,
      );

      this.triggerBeforeRequest('find', esParams, [query]);
      const res = await this.client.search<any>(esParams);

      const hits = res?.hits?.hits || [];

      return {
        raw: res,
        entities: hits.map((item) => {
          return this.entityTransformer.denormalize(this.Entity, {
            id: item._id,
            data: item?._source || {},
          });
        }),
      };
    } catch (e) {
      handleEsException(e);
    }
  }

  async findById(
    id: string,
    params: Partial<TransportRequestOptions> = {},
  ): Promise<EsResponseInterface<Entity>> {
    try {
      const esParams = Object.assign(
        {
          index: this.metaLoader.getIndex(this.Entity),
          id: id,
        },
        params,
      );

      this.triggerBeforeRequest('findById', esParams, [id]);
      const esRes = await this.client.get<any>(esParams);

      return {
        raw: esRes,
        entity: this.entityTransformer.denormalize(this.Entity, {
          id: esRes._id,
          data: esRes._source,
        }),
      };
    } catch (e) {
      handleEsException(e);
    }
  }

  async findOne(query: EsQuery<Entity>): Promise<EsResponseInterface<Entity>> {
    const res = await this.find({ ...query, size: 1 });
    return {
      raw: res.raw,
      entity: res.entities[0],
    };
  }

  async findOneOrFail(
    query: EsQuery<Entity>,
  ): Promise<EsResponseInterface<Entity>> {
    const res = await this.findOne(query);
    if (!res.entity) {
      throw new EsEntityNotFoundException();
    }
    return res;
  }

  async update(
    entity: Entity,
    params: Partial<TransportRequestOptions> = {},
  ): Promise<EsResponseInterface<Entity>> {
    try {
      const dbEntity = this.entityTransformer.normalize(entity);

      const esParams = Object.assign(
        {
          index: this.getIndex(entity),
          id: dbEntity.id,
          refresh: this.getRefreshOption(entity),
          body: { doc: dbEntity.data },
        },
        params,
      );

      this.triggerBeforeRequest('update', esParams, [entity]);
      return {
        raw: await this.client.update(esParams),
        entity: (await this.findById(dbEntity.id)).entity,
      };
    } catch (e) {
      handleEsException(e);
    }
  }

  updateMultiple(
    entities: Entity[],
    params: Partial<TransportRequestOptions> = {},
  ): Promise<EsBulkResponseInterface<Entity>> {
    return this.makeBulkRequest(entities, 'update', params);
  }

  async index(
    entity: Entity,
    params: Partial<TransportRequestOptions> = {},
  ): Promise<EsResponseInterface<Entity>> {
    try {
      const dbEntity = this.entityTransformer.normalize(entity);

      const esParams = Object.assign(
        {
          index: this.getIndex(entity),
          id: dbEntity.id,
          refresh: this.getRefreshOption(entity),
          body: dbEntity.data,
        },
        params,
      );

      this.triggerBeforeRequest('index', esParams, [entity]);

      return {
        raw: await this.client.index(esParams),
        entity: this.entityTransformer.denormalize(
          entity.constructor as ClassType<Entity>,
          dbEntity,
        ),
      };
    } catch (e) {
      handleEsException(e);
    }
  }

  indexMultiple(
    entities: Entity[],
    params: Partial<TransportRequestOptions> = {},
  ): Promise<EsBulkResponseInterface<Entity>> {
    return this.makeBulkRequest(entities, 'index', params);
  }

  async createIndex(
    indexInterface: EsIndexInterface,
    params: Partial<TransportRequestOptions> = {},
  ): Promise<void> {
    try {
      const esParams = Object.assign(
        {
          index: this.metaLoader.getIndex(this.Entity),
          body: indexInterface,
        },
        params,
      );

      this.triggerBeforeRequest('createIndex', esParams, [indexInterface]);

      await this.client.indices.create(esParams);
    } catch (e) {
      handleEsException(e);
    }
  }

  async deleteIndex(
    params: Partial<TransportRequestOptions> = {},
  ): Promise<void> {
    try {
      const esParams = Object.assign(
        {
          index: this.metaLoader.getIndex(this.Entity),
        },
        params,
      );

      this.triggerBeforeRequest('deleteIndex', esParams, []);
      await this.client.indices.delete(esParams);
    } catch (e) {
      handleEsException(e);
    }
  }

  async updateMapping(
    mapping: EsMappingInterface,
    params: Partial<TransportRequestOptions> = {},
  ): Promise<void> {
    try {
      const esParams = Object.assign(
        {
          index: this.metaLoader.getIndex(this.Entity),
          body: mapping,
        },
        params,
      );

      this.triggerBeforeRequest('updateMapping', esParams, [mapping]);
      await this.client.indices.putMapping(esParams);
    } catch (e) {
      handleEsException(e);
    }
  }

  getEntity(): ClassType<Entity> {
    return this.Entity;
  }

  private getIndex(entity: Entity, query?: EsQuery) {
    return this.metaLoader.getIndex(entity, query);
  }

  private getRefreshOption(entity: Entity) {
    return this.metaLoader.getReflectMetaData(
      entity.constructor as ClassType<Entity>,
    ).entity.options.refresh;
  }

  private async makeBulkRequest(
    entities: Entity[],
    type: 'create' | 'index' | 'update',
    params: Partial<TransportRequestOptions>,
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

      const esBulkParams = Object.assign(
        {
          refresh: true,
          body: bulkRequestBody,
        },
        params,
      );

      this.triggerBeforeRequest(
        (type + 'Multiple') as EsActionTypes,
        esBulkParams,
        [entities],
      );

      const bulkRes = await this.client.bulk(esBulkParams);

      query.size = (query.query as EsTermIdsQueryType).ids.values.length;
      return {
        entities: (await this.find(query)).entities,
        raw: bulkRes,
        hasErrors: !!bulkRes.errors,
      };
    } catch (e) {
      handleEsException(e);
    }
  }
}
