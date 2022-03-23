import {EsException} from "./EsException";

export class EsEntityNotFoundException extends EsException{
  public constructor(message = 'Entity not found', public originalError?: Error) {
    super(message);
  }
}
