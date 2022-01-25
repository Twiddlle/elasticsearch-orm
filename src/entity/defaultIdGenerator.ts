import { idGenerator } from '../decorators/EsProperty';
import { nanoid } from 'nanoid';

export const defaultIdGenerator: idGenerator = () => {
  return nanoid();
};
