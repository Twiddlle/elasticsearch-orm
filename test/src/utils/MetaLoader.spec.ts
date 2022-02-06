import { MetaLoader } from '../../../src/utils/MetaLoader';
import { TestingClass } from '../../fixtures/TestingClass';
import { TestingClass as TestingClass2 } from '../../fixtures/TestingClass2';
import { FactoryProvider } from '../../../src/factory/Factory.provider';
import {
  NotValidEntity,
  NotValidEntityWithMultipleIds1,
  NotValidEntityWithNoId,
} from '../../fixtures/NotValidEntities';

describe('meta loader', () => {
  let metaLoader: MetaLoader;

  beforeAll(() => {
    metaLoader = FactoryProvider.makeMetaLoader();
  });

  it('should load metadata', () => {
    const metadata = metaLoader.getReflectMetaData(TestingClass);

    expect(metadata.entity.index).toBe('test_index_main');
    expect(metadata.entity.name).toBe(TestingClass.name);
    expect(metadata.entity.aliases[0]).toBe('test_alias_read');
    expect(metadata.entity.aliases[1]).toBe('test_alias_write');

    expect(metadata.props[0].type).toBe('id');
    expect(metadata.props[0].name).toBe('id');
    expect(metadata.props[1].fieldOptions.boost).toBe(10);
    expect(metadata.props[1].type).toBe('integer');
    expect(metadata.props[1].name).toBe('Foo');
    expect(metadata.props[1].fieldOptions.boost).toBe(10);
    expect(metadata.props[2].type).toBe('boolean');
    expect(metadata.props[2].name).toBe('bar');
    expect(metadata.props[3].type).toBe('geo_point');
    expect(metadata.props[3].name).toBe('geoPoint');
  });

  it('should load metadata of same class name from different file', () => {
    const metadata = metaLoader.getReflectMetaData(TestingClass2);

    expect(metadata.entity.index).toBe('test_index_main_2');
    expect(metadata.entity.name).toBe(TestingClass2.name);
    expect(metadata.entity.aliases[0]).toBe('test_alias_read_2');
    expect(metadata.entity.aliases[1]).toBe('test_alias_write_2');

    expect(metadata.props[0].type).toBe('id');
    expect(metadata.props[0].name).toBe('id');
    expect(metadata.props[1].fieldOptions.boost).toBe(10);
    expect(metadata.props[1].type).toBe('integer');
    expect(metadata.props[1].name).toBe('Foo_2');
    expect(metadata.props[1].fieldOptions.boost).toBe(10);
    expect(metadata.props[2].type).toBe('boolean');
    expect(metadata.props[2].name).toBe('bar2');
    expect(metadata.props[3].type).toBe('geo_point');
    expect(metadata.props[3].name).toBe('geoPoint2');
  });

  it('should throw not valid entity', () => {
    let error;
    try {
      metaLoader.getReflectMetaData(NotValidEntity);
    } catch (e) {
      error = e;
    }
    expect(error.message).toBe('NotValidEntity is not valid elastic entity');
  });

  it('should throw not defined id', () => {
    let error;
    try {
      metaLoader.getReflectMetaData(NotValidEntityWithNoId);
    } catch (e) {
      error = e;
    }
    expect(error.message).toBe(
      'Entity NotValidEntityWithNoId does not have specified id property. Use @EsId decorator or set isId on true.',
    );
  });

  it('should throw multiple ids error', () => {
    let error;
    try {
      metaLoader.getReflectMetaData(NotValidEntityWithMultipleIds1);
    } catch (e) {
      error = e;
    }
    expect(error.message).toBe(
      'Entity NotValidEntityWithMultipleIds1 has defined multiple identifiers.',
    );
  });
});
