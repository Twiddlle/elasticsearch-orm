import { NormalizedEntity } from '../entity/Normalized.entity';
import { EsValidationException } from '../exceptions/EsValidationException';
import { ClassType } from '../types/Class.type';
import {
  EsMetaDataInterface,
  EsPropsMetaDataInterface,
} from '../types/EsMetaData.interface';
import { EsPropertyTypedOptions } from '../types/EsPropertyOptions.intarface';
import { MetaLoader } from './MetaLoader';

export class EntityTransformer {
  constructor(private readonly metaLoader: MetaLoader) {}

  normalize(entities: unknown[]): NormalizedEntity[];
  normalize(entity: unknown): NormalizedEntity;

  normalize(
    entity: unknown[] | unknown,
  ): NormalizedEntity | NormalizedEntity[] {
    if (entity instanceof Array) {
      return entity.map((e) => this.normalizeEntity(e));
    }
    return this.normalizeEntity(entity);
  }

  private normalizeEntity(entity: unknown): NormalizedEntity {
    if (!(entity instanceof Object)) {
      throw new EsValidationException('Not valid entity to normalize');
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
    if (entity instanceof Array) {
      return entity.map((entityItem) => {
        return this.normalizeProps(entityItem, props, meta);
      });
    }

    const dbEntityData: Record<string, unknown> = {};
    for (const prop of props) {
      // eslint-disable-next-line no-prototype-builtins
      if (!entity.hasOwnProperty(prop.options.entityPropName)) {
        continue;
      }

      const value = entity[prop.options.entityPropName];
      if (prop.isNested && value !== undefined && value !== null) {
        dbEntityData[prop.options.name] = this.normalizeProps(
          value,
          prop.props,
          meta,
        );
      } else {
        dbEntityData[prop.options.name] = value;
      }
    }
    return dbEntityData;
  }

  denormalize<T>(type: ClassType<T>, dbEntity: NormalizedEntity): T;
  denormalize<T>(type: ClassType<T>, dbEntity: NormalizedEntity[]): T[];

  denormalize<T>(
    type: ClassType<T>,
    dbEntity: NormalizedEntity | NormalizedEntity[],
  ): T | T[] {
    if (dbEntity instanceof Array) {
      return dbEntity.map((e) => this.denormalizeEntity(type, e));
    }
    return this.denormalizeEntity(type, dbEntity);
  }

  private denormalizeEntity<T>(
    type: ClassType<T>,
    dbEntity: NormalizedEntity,
  ): T {
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
    if (dbEntityData instanceof Array) {
      return dbEntityData.map((dbEntityDataItem) => {
        let dbEntityDataItemCloned = denormalizedEntity;
        if (
          denormalizedEntity instanceof Object &&
          denormalizedEntity?.constructor
        ) {
          dbEntityDataItemCloned =
            new (denormalizedEntity.constructor as ClassType<T>)();
        }
        return this.denormalizeProps(
          dbEntityDataItemCloned,
          dbEntityDataItem,
          props,
          meta,
        );
      });
    }

    for (const prop of props) {
      const strategyPropName = prop.options.name;
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
            this.denormalizeProp(prop, dbEntityData[strategyPropName]);
        }
      }
    }
    return denormalizedEntity;
  }

  private denormalizeProp(propMeta: EsPropsMetaDataInterface, propValue) {
    if (propValue instanceof Array) {
      return propValue.map((propValueItem) => {
        return this.denormalizeProp(propMeta, propValueItem);
      });
    }
    if (
      (propMeta.options as EsPropertyTypedOptions).type === 'date' &&
      !!propValue
    ) {
      return new Date(propValue);
    }

    return propValue;
  }

  private getMeta(entity) {
    const metaData = this.metaLoader.getReflectMetaData(entity.constructor);
    if (!metaData || !metaData.entity || !metaData.props) {
      throw new EsValidationException(
        `${entity.constructor.name} is not valid elastic entity`,
      );
    }
    return metaData;
  }
}
