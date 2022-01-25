import { MetaLoader } from './MetaLoader';
import { ClassType } from '../types/Class.type';
import { EsMetaDataInterface } from '../types/EsMetaData.interface';
import { EsMappingInterface } from '../types/EsMapping.interface';
import { EsIndexInterface } from '../types/EsIndex.interface';

export class SchemaManager {
  constructor(private readonly metaLoader: MetaLoader) {}

  generateIndexSchema<T>(Entity: ClassType<T>): EsIndexInterface {
    const meta = this.metaLoader.getReflectMetaData(Entity);

    return {
      settings: meta.entity.settings,
      mappings: this.buildMapping(meta),
    };
  }

  buildMapping(meta: EsMetaDataInterface) {
    const mapping: EsMappingInterface = {
      dynamic: meta.entity.mapping.dynamic,
      properties: {},
    };

    for (const prop of meta.props) {
      if (!prop.isId) {
        mapping.properties[prop.name] = {
          type: prop.type,
          ...prop.fieldOptions,
        };
      }
    }

    return mapping;
  }
}
