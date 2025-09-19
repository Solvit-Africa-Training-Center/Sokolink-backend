import nodemailer from 'nodemailer';

interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // default to Gmail if not set
    port: Number(process.env.SMTP_PORT) || 465, // default secure port
    secure: process.env.SMTP_SECURE === 'true' || true, // true for 465, false for others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendEmail({ to, subject, html }: IEmailOptions) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials are not set in environment variables!');
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Sokolink" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}: ${info.messageId}`);
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  }
}

export { EmailService };
