import { ClassType } from '../types/Class.type';
import { EsException } from '../exceptions/EsException';

export function makeEsException(
  error: Error,
  exceptionType: ClassType<EsException> = EsException,
): EsException {
  if (error instanceof EsException) {
    return error;
  }
  const exception = new exceptionType(error.message);
  exception.originalError = error;
  return exception;
}

export function handleEsException(
  error: Error,
  exceptionType: ClassType<EsException> = EsException,
): never {
  throw makeEsException(error, exceptionType);
}
