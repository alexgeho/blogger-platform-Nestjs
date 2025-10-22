import { pipesSetup } from '../../../Downloads/ed-back-lessons-bloggers-nest-main/src/setup/pipes.setup';
import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from '../../../Downloads/ed-back-lessons-bloggers-nest-main/src/setup/global-prefix.setup';
import { swaggerSetup } from '../../../Downloads/ed-back-lessons-bloggers-nest-main/src/setup/swagger.setup';

export function appSetup(app: INestApplication) {
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app);
}
