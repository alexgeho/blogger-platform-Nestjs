import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { Templates } from './email.templates';
import { EmailAdapter } from './email.adapter';

@Module({
  providers: [EmailService, Templates, EmailAdapter],
  exports: [EmailService, Templates, EmailAdapter],
})
export class NotificationsModule {}
