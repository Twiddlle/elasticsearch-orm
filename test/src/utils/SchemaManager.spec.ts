import { TestingClass } from '../../fixtures/TestingClass';
import { SchemaManager } from '../../../src/utils/SchemaManager';
import { FactoryProvider } from '../../../src/factory/Factory.provider';

describe('schema manager spec', () => {
  let schemaManager: SchemaManager;

  beforeAll(() => {
    schemaManager = FactoryProvider.makeSchemaManager();
  });

  it('should generate index schema', () => {
    const schema = schemaManager.generateIndexSchema(TestingClass);
    console.log(schema);
  });
});
