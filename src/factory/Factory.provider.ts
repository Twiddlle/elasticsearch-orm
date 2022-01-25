import { MetaLoader } from '../utils/MetaLoader';
import { SchemaManager } from '../utils/SchemaManager';
import { EntityTransformer } from '../utils/EntityTransformer';

export class FactoryProvider {
  public static makeMetaLoader() {
    return MetaLoader.getInstance();
  }

  public static makeEntityTransformer() {
    return new EntityTransformer(FactoryProvider.makeMetaLoader());
  }

  public static makeSchemaManager() {
    return new SchemaManager(FactoryProvider.makeMetaLoader());
  }
}
