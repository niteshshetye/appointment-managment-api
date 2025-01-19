import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import pug from 'pug';
import { convert } from 'html-to-text';
import { PRODUCTION } from './constants';

export class Email {
  to: string;
  firstname: string;
  from: string;
  url: string;

  constructor(user: { email: string; firstname: string }, url: string) {
    this.to = user.email;
    this.firstname = user.firstname;
    this.from = `Nitesh shetye <${process.env.EMAIL_FROM}>`;
    this.url = url;
  }

  createTransport() {
    if (process.env.NODE_ENV !== PRODUCTION) {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || '',
        port: process.env.EMAIL_PORT,
        auth: {
          // Activate in gmail "less secure app" option
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      } as SMTPTransport.Options);
    }

    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }

  async send(template: string, subject: string) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstname: this.firstname,
      url: this.url,
      subject,
    });

    // 2)  Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: convert(html, {
        wordwrap: 130,
      }),
    };

    const trasport = this.createTransport();
    await trasport.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Nimap infotech organization');
  }

  async sendResetPassword() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 min)',
    );
  }
}
