import { TestingClass } from '../../../fixtures/TestingClass';
import { TestingClass as TestingClass2 } from '../../../fixtures/TestingClass2';
import { EntityTransformer } from '../../../../src/utils/EntityTransformer';
import { FactoryProvider } from '../../../../src/factory/Factory.provider';
import { TestingClassWithCamelNamingStrategy } from '../../../fixtures/TestingClassWithCamelNamingStrategy';
import { TestingClassWithSnakeNamingStrategy } from '../../../fixtures/TestingClassWithSnakeNamingStrategy';

describe('entity transformer', () => {
  let entityTransformer: EntityTransformer;
  const testingClass1 = new TestingClass();
  testingClass1.id = '25u46fhno';
  testingClass1.foo = 1;
  testingClass1.bar = false;
  testingClass1.geoPoint = [12, 13];

  const testingClass2 = new TestingClass2();
  testingClass2.id = 'doljgm4';
  testingClass2.foo2 = 2;
  testingClass2.bar2 = true;
  testingClass2.geoPoint2 = [14, 15];

  beforeAll(() => {
    entityTransformer = FactoryProvider.makeEntityTransformer();
  });

  it('should transform entity', () => {
    const normalizedEntity = entityTransformer.normalize(testingClass1);
    expect(normalizedEntity.id).toBe('25u46fhno');
    expect(normalizedEntity.data.Foo).toBe(1);
    expect(normalizedEntity.data.bar).toBe(false);
    expect(normalizedEntity.data.geoPoint[0]).toBe(12);
    expect(normalizedEntity.data.geoPoint[1]).toBe(13);

    const denormalizedEntity = entityTransformer.denormalize(
      TestingClass,
      normalizedEntity,
    );

    expect(denormalizedEntity).toMatchObject(testingClass1);

    const normalizedEntityRetried =
      entityTransformer.normalize(denormalizedEntity);
    expect(normalizedEntityRetried).toMatchObject(normalizedEntity);
  });

  it('should transform entity of same class name from different file', () => {
    const normalizedEntity = entityTransformer.normalize(testingClass2);
    expect(normalizedEntity.id).toBe('doljgm4');
    expect(normalizedEntity.data.Foo_2).toBe(2);
    expect(normalizedEntity.data.bar2).toBe(true);
    expect(normalizedEntity.data.geoPoint2[0]).toBe(14);
    expect(normalizedEntity.data.geoPoint2[1]).toBe(15);

    const denormalizedEntity = entityTransformer.denormalize(
      TestingClass2,
      normalizedEntity,
    );

    expect(denormalizedEntity).toMatchObject(testingClass2);

    const normalizedEntityRetried =
      entityTransformer.normalize(denormalizedEntity);
    expect(normalizedEntityRetried).toMatchObject(normalizedEntity);
  });

  it('should transform entity with camel case strategy naming', () => {
    const camelEntity = new TestingClassWithCamelNamingStrategy();
    camelEntity.full_name = 'Bradley Cooper';
    camelEntity.full_address = 'Somewhere';
    const normalizedEntity = entityTransformer.normalize(camelEntity);
    expect(normalizedEntity.id).toHaveLength(21);
    expect(normalizedEntity.data.fullName).toBe(camelEntity.full_name);
    expect(normalizedEntity.data.fullAddress).toBe(camelEntity.full_address);

    const denormalizedEntity = entityTransformer.denormalize(
      TestingClassWithCamelNamingStrategy,
      normalizedEntity,
    );

    expect(denormalizedEntity).toMatchObject(camelEntity);

    const normalizedEntityRetried =
      entityTransformer.normalize(denormalizedEntity);
    expect(normalizedEntityRetried).toMatchObject(normalizedEntity);
  });

  it('should transform entity with camel case strategy naming', () => {
    const snakeEntity = new TestingClassWithSnakeNamingStrategy();
    snakeEntity.fullName = 'John von Neumann';
    snakeEntity.fullAddress = 'Hungary';
    const normalizedEntity = entityTransformer.normalize(snakeEntity);
    expect(normalizedEntity.id).toHaveLength(21);
    expect(normalizedEntity.data.fullName).toBe(snakeEntity.fullName);
    expect(normalizedEntity.data.fullAddress).toBe(snakeEntity.fullAddress);

    const denormalizedEntity = entityTransformer.denormalize(
      TestingClassWithSnakeNamingStrategy,
      normalizedEntity,
    );

    expect(denormalizedEntity).toMatchObject(snakeEntity);

    const normalizedEntityRetried =
      entityTransformer.normalize(denormalizedEntity);
    expect(normalizedEntityRetried).toMatchObject(normalizedEntity);
  });
});
