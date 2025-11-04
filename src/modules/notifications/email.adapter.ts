import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

type MailResult = boolean;

@Injectable()
export class EmailAdapter {
  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<MailResult> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'alexgehasve@gmail.com',
        pass: process.env.GMAIL_PASS || 'fict pabq tjzs vqnt',
      },
    });

    try {
      await transporter.sendMail({
        from: `"Alexander Gerhard" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }
}
