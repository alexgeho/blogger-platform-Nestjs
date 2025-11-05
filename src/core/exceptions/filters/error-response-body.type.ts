import { Extension } from '../domain-exceptions';
import { DomainExceptionCode } from '../domain-exception-codes';

export type ErrorResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: Extension[];
  code: DomainExceptionCode;
};

export type ValidationErrorResponseBody = {
  errorsMessages: { message: string; field: string }[];
};
