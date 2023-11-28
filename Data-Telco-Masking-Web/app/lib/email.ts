import nodemailer from "nodemailer"

type EmailPayload = {
  to: string
  subject: string
  text: string
  attachments?: { filename: string; href: string }[];
}

// Replace with your SMTP credentials
const smtpOptions = {
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASS
  },
}

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  })

  return await transporter.sendMail({
    from: process.env.EMAIL_ACCOUNT,
    ...data,
  })
}
