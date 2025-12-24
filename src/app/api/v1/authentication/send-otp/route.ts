import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { sendOTPEmail, generateOTP } from '@/src/utils/emailService.util';
import { ApiResponse } from '@/src/types/apiResponse.type';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Email is required',
        data: null,
      }, { status: 200 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid email format',
        data: null,
      }, { status: 200 });
    }

    // Check if email is currently blocked
    const existingOtp = await prisma.emailOtp.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingOtp?.blockedUntil && existingOtp.blockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (existingOtp.blockedUntil.getTime() - new Date().getTime()) / 60000
      );
      return NextResponse.json<ApiResponse>({
        success: false,
        message: `Too many failed attempts. Please try again in ${remainingMinutes} minute(s).`,
        data: null,
      }, { status: 200 });
    }

    // Check if 2 minutes have passed since last OTP was sent
    if (existingOtp && existingOtp.expiresAt > new Date()) {
      const timeSinceLastSent = new Date().getTime() - existingOtp.updatedAt.getTime();
      const twoMinutesInMs = 2 * 60 * 1000;
      
      if (timeSinceLastSent < twoMinutesInMs) {
        const remainingSeconds = Math.ceil((twoMinutesInMs - timeSinceLastSent) / 1000);
        return NextResponse.json<ApiResponse>({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
          data: null,
        }, { status: 200 });
      }
    }

    // Check resend limit (max 3 times)
    if (existingOtp && existingOtp.resendCount >= 3 && existingOtp.expiresAt > new Date()) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Maximum resend limit reached. Please wait for the current OTP to expire.',
        data: null,
      }, { status: 200 });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Get user name if exists
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
      select: { name: true },
    });

    // Send OTP email
    const emailSent = await sendOTPEmail({
      email: email.toLowerCase(),
      otp,
      userName: user?.name || undefined,
    });

    if (!emailSent) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to send OTP email. Please try again.',
        data: null,
      }, { status: 500 });
    }

    // Store or update OTP in database
    const resendCount = existingOtp?.expiresAt && existingOtp.expiresAt > new Date()
      ? existingOtp.resendCount + 1
      : 0;

    await prisma.emailOtp.upsert({
      where: { email: email.toLowerCase() },
      update: {
        otp,
        expiresAt,
        resendCount,
        wrongAttempts: 0,
        blockedUntil: null,
        updatedAt: new Date(),
      },
      create: {
        email: email.toLowerCase(),
        otp,
        expiresAt,
        resendCount: 0,
        wrongAttempts: 0,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'OTP sent successfully! Check your email.',
      data: {
        email: email.toLowerCase(),
        expiresAt,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'An error occurred. Please try again.',
      data: null,
    }, { status: 500 });
  }
}
