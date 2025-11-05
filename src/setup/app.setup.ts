import { pipesSetup } from './pipes.setup';
import { INestApplication } from '@nestjs/common';
import { AllHttpExceptionsFilter } from '../core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from '../core/exceptions/filters/domain-exceptions.filter';

export function appSetup(app: INestApplication) {
  pipesSetup(app);

  app.useGlobalFilters(
    new AllHttpExceptionsFilter(),
    new DomainHttpExceptionsFilter(),
  );
}
