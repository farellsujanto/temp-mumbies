/**
 * Email Service Utility
 * Handles sending OTP emails to users
 */

import nodemailer from 'nodemailer';

interface SendOTPEmailParams {
  email: string;
  otp: string;
  userName?: string;
}

// Create nodemailer transporter
const createTransporter = () => {
  // Check if Gmail credentials are configured
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn('⚠️ Email credentials not configured. Emails will only be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass, // Use App Password, not regular Gmail password
    },
  });
};

export async function sendOTPEmail({ email, otp, userName }: SendOTPEmailParams): Promise<boolean> {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mumbies - Your Login Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #10b981; font-size: 32px; font-weight: bold; margin: 0;">Mumbies</h1>
              <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Premium Natural Dog Chews 🐾</p>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
                ${userName ? `Hey ${userName}! 👋` : 'Welcome! 👋'}
              </h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Your verification code is ready. Enter it to access your Mumbies account and continue your impact journey.
              </p>
              
              <!-- OTP Code -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">
                  Your verification code
                </p>
                <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 16px; display: inline-block;">
                  <p style="color: white; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </p>
                </div>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="color: #92400e; font-size: 14px; line-height: 1.5; margin: 0;">
                  ⏱️ <strong>This code expires in 10 minutes.</strong> If you didn't request this code, you can safely ignore this email.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
                Questions? We're here to help! Reach out to us at 
                <a href="mailto:support@mumbies.com" style="color: #10b981; text-decoration: none;">support@mumbies.com</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0;">
                © ${new Date().getFullYear()} Mumbies. Premium natural dog chews from Milwaukee, WI.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                You're receiving this because you requested a login code for Mumbies.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
      Mumbies - Your Login Code
      
      ${userName ? `Hey ${userName}!` : 'Welcome!'}
      
      Your verification code is: ${otp}
      
      This code expires in 10 minutes. If you didn't request this code, you can safely ignore this email.
      
      Questions? Contact us at support@mumbies.com
      
      © ${new Date().getFullYear()} Mumbies
    `;

    // Create transporter
    const transporter = createTransporter();

    if (!transporter) {
      // Development mode: log the OTP to console
      console.log(`
      ═══════════════════════════════════════
      📧 OTP EMAIL (Development Mode)
      ═══════════════════════════════════════
      To: ${email}
      Subject: Your Mumbies login code: ${otp}
      
      OTP Code: ${otp}
      Expires: 10 minutes
      ═══════════════════════════════════════
      `);
      return true;
    }

    // Send email using nodemailer
    await transporter.sendMail({
      from: `"Mumbies" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Mumbies login code: ${otp}`,
      text: emailText,
      html: emailHtml,
    });

    console.log(`✅ OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a unique Mumbies referral code
 * Format: MUMBXXXXXXXX (where X is alphanumeric)
 */
export function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  
  for (let i = 0; i < 8; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return `MUMB${randomPart}`;
}
