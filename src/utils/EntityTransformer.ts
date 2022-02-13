import { MetaLoader } from './MetaLoader';
import { ClassType } from '../types/Class.type';
import { NormalizedEntity } from '../entity/Normalized.entity';
import {
  EsMetaDataInterface,
  EsPropsMetaDataInterface,
} from '../types/EsMetaData.interface';

export class EntityTransformer {
  constructor(private readonly metaLoader: MetaLoader) {}

  normalize(entity: unknown): NormalizedEntity {
    if (!(entity instanceof Object)) {
      throw new Error('Not valid entity to normalize');
    }
    const metaData = this.getMeta(entity);
    const dbEntity: NormalizedEntity = {
      id: entity[metaData.idPropName] || metaData.idGenerator(entity),
      data: this.normalizeProps(entity, metaData.props, metaData),
    };
    delete dbEntity.data[metaData.idPropName];
    return dbEntity;
  }

  private normalizeProps(
    entity: unknown,
    props: EsPropsMetaDataInterface[],
    meta: EsMetaDataInterface,
  ) {
    const dbEntityData: Record<string, unknown> = {};
    for (const prop of props) {
      if (prop.isNested) {
        dbEntityData[prop.options.name] = this.normalizeProps(
          entity[prop.options.entityPropName],
          prop.props,
          meta,
        );
      } else {
        dbEntityData[meta.entity.namingStrategy(prop)] =
          entity[prop.options.entityPropName];
      }
    }
    return dbEntityData;
  }

  denormalize<T>(type: ClassType<T>, dbEntity: NormalizedEntity): T {
    const entity = new type();
    const metaData = this.getMeta(entity);
    entity[metaData.idPropName] = dbEntity.id;
    this.denormalizeProps(entity, dbEntity.data, metaData.props, metaData);
    return entity;
  }

  private denormalizeProps<T>(
    denormalizedEntity: T,
    dbEntityData: Record<string, unknown>,
    props: EsPropsMetaDataInterface[],
    meta: EsMetaDataInterface,
  ) {
    for (const prop of props) {
      const strategyPropName = meta.entity.namingStrategy(prop);
      if (dbEntityData[strategyPropName] !== undefined) {
        if (prop.isNested) {
          denormalizedEntity[prop.options.entityPropName] =
            this.denormalizeProps(
              new prop.options.entity(),
              dbEntityData[strategyPropName] as Record<string, unknown>,
              prop.props,
              meta,
            );
        } else {
          denormalizedEntity[prop.options.entityPropName] =
            dbEntityData[strategyPropName];
        }
      }
    }
    return denormalizedEntity;
  }

  private getMeta(entity) {
    const metaData = this.metaLoader.getReflectMetaData(entity.constructor);
    if (!metaData || !metaData.entity || !metaData.props) {
      throw new Error(`${entity.constructor.name} is not valid elastic entity`);
    }
    return metaData;
  }
}
