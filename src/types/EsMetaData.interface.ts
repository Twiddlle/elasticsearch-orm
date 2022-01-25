import { ESClassFullTypeOptionsInterface } from './EsClassTypeOptions.interface';
import { EsPropertyFullOptions, idGenerator } from '../decorators/EsProperty';

export interface EsMetaDataInterface {
  entity: ESClassFullTypeOptionsInterface;
  props: EsPropertyFullOptions[];
  idPropName: string;
  idGenerator: idGenerator;
}
