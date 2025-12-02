import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const baseUrl =
    process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(
    token
  )}`;

  await transport.sendMail({
    from: process.env.EMAIL_FROM || "noreply@zimdrivecoach.com",
    to,
    subject: "Verify your ZimDrive Coach account",
    html: `
      <p>Hi there,</p>
      <p>Welcome to ZimDrive Coach. Please verify your email to activate your account.</p>
      <p><a href="${verifyUrl}">Verify my email</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
}
