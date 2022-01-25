import { nanoid } from 'nanoid';
import { idGenerator } from '../types/EsPropertyOptions.intarface';

export const defaultIdGenerator: idGenerator = () => {
  return nanoid();
};
