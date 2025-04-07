import {ErrorCause} from "@elastic/elasticsearch/lib/api/types";

export class EsException extends Error implements ErrorCause{
  public constructor(message?: string, public originalError?: Error) {
    super(message);

    // `originalError` is conventional in ES6 / ES2015 which we target
    // `cause` is standard in Node 16.9+ / ES2021+
    Object.defineProperty(this, "cause", {
      get: () => this.originalError,
      set: (newVal: unknown) => {
        this.originalError = newVal as Error;
      },
      enumerable: false,
    });
  }

  caused_by: ErrorCause;
  reason: string;
  root_cause: ErrorCause[];
  stack_trace: string;
  suppressed: ErrorCause[];
  type: string;

  // this property exists on `Error` in ES2021+
  cause: unknown;
}
