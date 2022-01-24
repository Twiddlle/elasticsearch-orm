import 'reflect-metadata';
import { EsProperty, EsPropertyFullOptions } from '../decorators/EsProperty';
import { ClassType } from '../types/Class.type';
import { EsEntity } from '../decorators/EsEntity';
import { EsMetaDataInterface } from '../types/EsMetaData.interface';

export class MetaLoader {
  private cache = new Map<ClassType<unknown>, EsMetaDataInterface>();

  public getReflectMetaData<T = unknown>(
    Entity: ClassType<T>,
  ): EsMetaDataInterface | undefined {
    if (!this.cache.has(Entity)) {
      const props = Reflect.getMetadata(
        EsProperty.name,
        new Entity(),
      ) as EsPropertyFullOptions[];
      let idPropName: string;
      for (const prop of props) {
        if (prop.isId) {
          idPropName = prop.entityPropName;
          break;
        }
      }

      const meta = {
        props,
        entity: Reflect.getMetadata(EsEntity.name, Entity),
        idPropName: idPropName,
      };

      MetaLoader.validateMetaData(Entity.name, meta);
      this.cache.set(Entity, meta);
    }

    return this.cache.get(Entity);
  }

  private static validateMetaData(
    entityName: string,
    metaData: Partial<EsMetaDataInterface>,
  ) {
    if (!metaData.idPropName) {
      throw new Error(
        `Entity ${entityName} does not have specified id property. Use @EsId decorator.`,
      );
    }
    if (!metaData || !metaData.entity || !metaData.props) {
      throw new Error(`Instance ${entityName} is not valid elastic entity`);
    }
  }

  public getIndex<T>(Entity: ClassType<T>) {
    return this.getReflectMetaData(Entity).entity.index;
  }

  public getIdPropName<T>(Entity: ClassType<T>) {
    return this.getReflectMetaData(Entity).idPropName;
  }
}
