import { MetaLoader } from './MetaLoader';
import { ClassType } from '../types/Class.type';

export class EntityTransformer {
  constructor(private readonly metaLoader: MetaLoader) {}

  normalize(entity: unknown): Record<string, unknown> {
    if (!(entity instanceof Object)) {
      throw new Error('Not valid entity to normalize');
    }
    const metaData = this.getMeta(entity);
    const dbEntity: Record<string, unknown> = {};
    for (const prop of metaData.props) {
      dbEntity[prop.name] = entity[prop.entityPropName];
    }
    return dbEntity;
  }

  denormalize<T>(type: ClassType<T>, dbEntity: Record<string, unknown>): T {
    const entity = new type();
    const metaData = this.getMeta(entity);
    for (const prop of metaData.props) {
      entity[prop.entityPropName] = dbEntity[prop.name];
    }
    return entity;
  }

  private getMeta(entity: unknown) {
    const metaData = this.metaLoader.getReflectMetaData(entity.constructor);
    if (!metaData || !metaData.entity || !metaData.props) {
      throw new Error(
        `Instance ${entity.constructor.name} is not valid elastic entity`,
      );
    }
    return metaData;
  }
}
