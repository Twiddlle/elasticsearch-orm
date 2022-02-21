import { EsFieldTypes } from './common';

export type EsSourceTypes<T = unknown> = boolean | EsFieldTypes<T>;
