export class EsException extends Error{
  public constructor(message?: string, public originalError?: Error) {
    super(message);
  }
}
