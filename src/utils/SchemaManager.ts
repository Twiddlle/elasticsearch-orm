import { MetaLoader } from './MetaLoader';
import { ClassType } from '../types/Class.type';
import {
  EsMetaDataInterface,
  EsPropsMetaDataInterface,
} from '../types/EsMetaData.interface';
import { EsMappingInterface } from '../types/EsMapping.interface';
import { EsIndexInterface } from '../types/EsIndex.interface';

export class SchemaManager {
  constructor(private readonly metaLoader: MetaLoader) {}

  generateIndexSchema<T>(Entity: ClassType<T>): EsIndexInterface {
    const meta = this.metaLoader.getReflectMetaData(Entity);
    const aliases = {};
    (meta.entity.aliases || []).forEach((alias) => {
      aliases[alias] = {};
    });

    return {
      aliases: aliases,
      settings: meta.entity.settings,
      mappings: this.buildMapping(meta),
    };
  }

  buildMapping(meta: EsMetaDataInterface) {
    const mapping: EsMappingInterface = {
      dynamic: meta.entity.mapping.dynamic,
      properties: {},
    };

    mapping.properties = this.buildMappingProperties(meta.props, meta);

    return mapping;
  }

  private buildMappingProperties(
    props: EsPropsMetaDataInterface[],
    meta: EsMetaDataInterface,
  ) {
    const mappingProperties: Record<string, Record<string, unknown>> = {};
    for (const prop of props) {
      if (!prop?.options?.isId) {
        if (prop.isNested) {
          mappingProperties[meta.entity.namingStrategy(prop)] = {
            type: 'nested',
            properties: this.buildMappingProperties(prop.props, meta),
          };
        } else {
          mappingProperties[meta.entity.namingStrategy(prop)] = {
            type: prop.options.type,
            ...prop.options.additionalFieldOptions,
          };
        }
      }
    }

    return mappingProperties;
  }
}
