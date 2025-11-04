import { Injectable } from '@nestjs/common';

@Injectable()
export class Templates {
  confirmation(code: string): string {
    return `
      <h1>Thank you for your registration</h1>
      <p>To finish registration please follow the link below:</p>
      <a href='https://alexgeho.github.io/bloggerPlatform-front/email-confirmed?code=${code}'>
        Complete registration
      </a>
    `;
  }

  recovery(recoveryCode: string): string {
    return `
      <h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:</p>
      <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>
        Recover password
      </a>
    `;
  }
}
