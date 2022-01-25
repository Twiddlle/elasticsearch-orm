import { ESClassFullTypeOptionsInterface } from './EsClassTypeOptions.interface';
import {
  EsPropertyFullOptions,
  idGenerator,
} from './EsPropertyOptions.intarface';

export interface EsMetaDataInterface {
  entity: ESClassFullTypeOptionsInterface;
  props: EsPropertyFullOptions[];
  idPropName: string;
  idGenerator: idGenerator;
}
