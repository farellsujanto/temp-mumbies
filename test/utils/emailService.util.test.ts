/**
 * Unit tests for Email Service Utility Functions
 */

import { generateOTP, generateReferralCode } from '@/src/utils/emailService.util';

describe('Email Service Utility', () => {
  describe('generateOTP', () => {
    it('should generate a 6-digit OTP', () => {
      const otp = generateOTP();
      
      expect(otp).toBeDefined();
      expect(otp.length).toBe(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate numeric OTP only', () => {
      const otp = generateOTP();
      
      expect(parseInt(otp, 10)).not.toBeNaN();
      expect(parseInt(otp, 10)).toBeGreaterThanOrEqual(100000);
      expect(parseInt(otp, 10)).toBeLessThanOrEqual(999999);
    });

    it('should generate different OTPs on multiple calls', () => {
      const otps = new Set();
      
      for (let i = 0; i < 100; i++) {
        otps.add(generateOTP());
      }
      
      // With 100 calls, we should get at least 95 unique OTPs (allowing for some collisions)
      expect(otps.size).toBeGreaterThan(95);
    });

    it('should not generate OTP less than 100000', () => {
      for (let i = 0; i < 10; i++) {
        const otp = generateOTP();
        expect(parseInt(otp, 10)).toBeGreaterThanOrEqual(100000);
      }
    });

    it('should not generate OTP greater than 999999', () => {
      for (let i = 0; i < 10; i++) {
        const otp = generateOTP();
        expect(parseInt(otp, 10)).toBeLessThanOrEqual(999999);
      }
    });
  });

  describe('generateReferralCode', () => {
    it('should generate referral code starting with MUMB', () => {
      const code = generateReferralCode();
      
      expect(code).toBeDefined();
      expect(code.startsWith('MUMB')).toBe(true);
    });

    it('should generate referral code with length 12', () => {
      const code = generateReferralCode();
      
      expect(code.length).toBe(12); // MUMB + 8 characters
    });

    it('should generate alphanumeric referral code', () => {
      const code = generateReferralCode();
      
      expect(/^MUMB[A-Z0-9]{8}$/.test(code)).toBe(true);
    });

    it('should generate different referral codes on multiple calls', () => {
      const codes = new Set();
      
      for (let i = 0; i < 100; i++) {
        codes.add(generateReferralCode());
      }
      
      // Should generate unique codes
      expect(codes.size).toBe(100);
    });

    it('should only contain uppercase letters and numbers after MUMB prefix', () => {
      const code = generateReferralCode();
      const randomPart = code.substring(4); // Remove MUMB prefix
      
      expect(/^[A-Z0-9]{8}$/.test(randomPart)).toBe(true);
    });

    it('should generate codes with valid characters only', () => {
      for (let i = 0; i < 10; i++) {
        const code = generateReferralCode();
        const randomPart = code.substring(4);
        
        for (const char of randomPart) {
          expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.includes(char)).toBe(true);
        }
      }
    });
  });
});
