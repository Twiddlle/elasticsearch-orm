import { MetaLoader } from './MetaLoader';
import { ClassType } from '../types/Class.type';
import { NormalizedEntity } from '../entity/Normalized.entity';

export class EntityTransformer {
  constructor(private readonly metaLoader: MetaLoader) {}

  normalize(entity: unknown): NormalizedEntity {
    if (!(entity instanceof Object)) {
      throw new Error('Not valid entity to normalize');
    }
    const metaData = this.getMeta(entity);
    const dbEntity: NormalizedEntity = {
      id: entity[metaData.idPropName] || metaData.idGenerator(entity),
      data: {},
    };
    for (const prop of metaData.props) {
      dbEntity.data[prop.name] = entity[prop.entityPropName];
    }
    delete dbEntity.data[metaData.idPropName];
    return dbEntity;
  }

  denormalize<T>(type: ClassType<T>, dbEntity: NormalizedEntity): T {
    const entity = new type();
    const metaData = this.getMeta(entity);
    entity[metaData.idPropName] = dbEntity.id;
    for (const prop of metaData.props) {
      if (dbEntity.data[prop.name] !== undefined) {
        entity[prop.entityPropName] = dbEntity.data[prop.name];
      }
    }
    return entity;
  }

  private getMeta(entity) {
    const metaData = this.metaLoader.getReflectMetaData(entity.constructor);
    if (!metaData || !metaData.entity || !metaData.props) {
      throw new Error(
        `Instance ${entity.constructor.name} is not valid elastic entity`,
      );
    }
    return metaData;
  }
}
