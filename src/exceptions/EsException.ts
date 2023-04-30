import {ErrorCause} from "@elastic/elasticsearch/lib/api/types";

export class EsException extends Error implements ErrorCause{
  public constructor(message?: string, public originalError?: Error) {
    super(message);
  }

  caused_by: ErrorCause;
  reason: string;
  root_cause: ErrorCause[];
  stack_trace: string;
  suppressed: ErrorCause[];
  type: string;
}
