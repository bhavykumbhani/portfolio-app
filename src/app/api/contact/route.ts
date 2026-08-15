import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing fields', message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // Check if SMTP credentials are configured in .env.local
    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          success: false,
          error: 'SMTP_NOT_CONFIGURED',
          message: 'SMTP credentials are not configured. Please add SMTP_USER and SMTP_PASS variables to your .env.local file to enable background email sending.'
        },
        { status: 200 } // Return status 200 so the client can handle the missing config gracefully
      );
    }

    // Configure the Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: smtpUser,
      to: 'bhkumbhani05@gmail.com', // Always sends to Bhavy's email
      replyTo: email,
      subject: subject || `Developer Portfolio Contact from ${name}`,
      text: `Hello Bhavy,\n\nYou have received a new contact message from your developer portfolio site:\n\n---\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n---`
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SMTP sending error:', error);
    return NextResponse.json(
      { success: false, error: 'SENDING_FAILED', message: error.message || 'Failed to send email via SMTP.' },
      { status: 500 }
    );
  }
}
