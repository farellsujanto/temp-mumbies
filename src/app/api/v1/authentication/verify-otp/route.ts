import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/utils/prismaOrm.util';
import { generateToken } from '@/src/utils/jwt.edge.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import { UserRole } from '@/generated/prisma/client';
import { generateReferralCode } from '@/src/utils/referral.util';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate inputs
    if (!email || typeof email !== 'string' || !otp || typeof otp !== 'string') {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Email and OTP are required',
        data: null,
      }, { status: 200 });
    }

    // Find OTP record
    const otpRecord = await prisma.emailOtp.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!otpRecord) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'No OTP found for this email. Please request a new one.',
        data: null,
      }, { status: 200 });
    }

    // Check if blocked
    if (otpRecord.blockedUntil && otpRecord.blockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (otpRecord.blockedUntil.getTime() - new Date().getTime()) / 60000
      );
      return NextResponse.json<ApiResponse>({
        success: false,
        message: `Account temporarily blocked. Please try again in ${remainingMinutes} minute(s).`,
        data: null,
      }, { status: 200 });
    }

    // Check if OTP expired
    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'OTP has expired. Please request a new one.',
        data: null,
      }, { status: 400 });
    }

    // Check if stored OTP is numeric (reject invalidated OTPs like 'XXXXXX')
    if (!/^\d{6}$/.test(otpRecord.otp) || !/^\d{6}$/.test(otp)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid OTP. Please request a new one.',
        data: null,
      }, { status: 200 });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      const newWrongAttempts = otpRecord.wrongAttempts + 1;
      
      // Block after 3 wrong attempts
      if (newWrongAttempts >= 3) {
        const blockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await prisma.emailOtp.update({
          where: { email: email.toLowerCase() },
          data: {
            wrongAttempts: newWrongAttempts,
            blockedUntil,
            updatedAt: new Date(),
          },
        });

        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Too many failed attempts. Account blocked for 15 minutes.',
          data: null,
        }, { status: 200 });
      }

      // Increment wrong attempts
      await prisma.emailOtp.update({
        where: { email: email.toLowerCase() },
        data: {
          wrongAttempts: newWrongAttempts,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json<ApiResponse>({
        success: false,
        message: `Invalid OTP. ${3 - newWrongAttempts} attempt(s) remaining.`,
        data: null,
      }, { status: 200 });
    }

    // OTP is valid! Find or create user
    let user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Generate unique referral code
      let referralCode = generateReferralCode();
      let isUnique = false;
      
      while (!isUnique) {
        const existing = await prisma.user.findFirst({
          where: { referralCode },
        });
        
        if (!existing) {
          isUnique = true;
        } else {
          referralCode = generateReferralCode();
        }
      }

      // Create new user
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          role: UserRole.CUSTOMER, // Default role
          referralCode,
          enabled: true,
        },
      });
    }

    // Invalidate the OTP (successful login)
    await prisma.emailOtp.update({
      where: { email: email.toLowerCase() },
      data: {
        otp: 'XXXXXX',
        wrongAttempts: 0,
        blockedUntil: null,
        updatedAt: new Date(),
      },
    });

    // Determine redirect URL based on role
    let redirectUrl = '/dashboard/account'; // default
    
    switch (user.role) {
      case UserRole.ADMIN:
        redirectUrl = '/dashboard/admin';
        break;
      case UserRole.PARTNER:
        redirectUrl = '/dashboard/partner';
        break;
      case UserRole.CUSTOMER:
        redirectUrl = '/dashboard/account';
        break;
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      role: user.role,
      referralCode: user.referralCode,
    });

    // Create response with token in cookie
    const response = NextResponse.json<ApiResponse>({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          referralCode: user.referralCode,
        },
        redirectUrl,
        token, // Also send in response body for client-side storage
      },
    }, { status: 200 });

    // Set JWT token in HTTP-only cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'An error occurred. Please try again.',
      data: null,
    }, { status: 500 });
  }
}
