import { Injectable } from '@nestjs/common';
import { EmailAdapter } from './email.adapter';
import { Templates } from './email.templates';

@Injectable()
export class EmailService {
  constructor(
    private emailAdapter: EmailAdapter,
    private templates: Templates,
  ) {}

  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    const html = this.templates.confirmation(code);
    const subject = 'Confirm your registration';
    await this.emailAdapter.sendEmail(email, subject, html);
  }
}
