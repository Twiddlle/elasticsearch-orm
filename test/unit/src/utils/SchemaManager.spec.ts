import { TestingClass } from '../../../fixtures/TestingClass';
import { SchemaManager } from '../../../../src/utils/SchemaManager';
import { FactoryProvider } from '../../../../src/factory/Factory.provider';

describe('schema manager spec', () => {
  let schemaManager: SchemaManager;

  beforeAll(() => {
    schemaManager = FactoryProvider.makeSchemaManager();
  });

  it('should generate index schema', () => {
    const schema = schemaManager.generateIndexSchema(TestingClass);

    expect(schema.settings.number_of_replicas).toBe(0);
    expect(schema.settings.number_of_shards).toBe(1);
    expect(schema.mappings.dynamic).toBe('strict');
    expect(schema.mappings.properties.foo.type).toBe('integer');
    expect(schema.mappings.properties.foo.coerce).toBe(true);
    expect(schema.mappings.properties.bar.type).toBe('boolean');
    expect(schema.mappings.properties.geoPoint.type).toBe('geo_point');
  });
});
