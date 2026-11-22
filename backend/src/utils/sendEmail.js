const nodemailer = require('nodemailer');

/**
 * Send email utility using Nodemailer
 * Automatically falls back to console logging in development if SMTP is not configured
 */
const sendEmail = async (options) => {
  const hasSmtpConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_USER !== 'your_smtp_user';

  if (!hasSmtpConfig) {
    console.log('----------------------------------------------------');
    console.log(`[EMAIL DISPATCH (DEV MODE - SMTP NOT CONFIGURED)]`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.text || options.html}`);
    console.log('----------------------------------------------------');
    return { devMode: true, messageId: 'simulated-dev-email-id' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Job Portal" <noreply@jobportal.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EMAIL] Sent successfully: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
