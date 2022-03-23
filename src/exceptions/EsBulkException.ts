import { EsException } from './EsException';

export class EsBulkException extends Error {
  public bulkExceptions: EsException[];

  public constructor(message?: string) {
    super(message);
  }
}
