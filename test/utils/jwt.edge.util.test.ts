/**
 * Unit tests for JWT Edge Utility Functions
 */

// Mock jose before importing
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock.jwt.token'),
  })),
  jwtVerify: jest.fn(),
}));

import { generateToken, verifyToken, extractTokenFromHeader, extractTokenFromCookies, hasRole } from '@/src/utils/jwt.edge.util';
import { UserRole } from '@/generated/prisma/client';
import { jwtVerify } from 'jose';

describe('JWT Edge Utility', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', async () => {
      const payload = {
        userId: 1,
        role: 'USER' as UserRole,
        referralCode: 'MUMB12345678',
      };

      const token = await generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toBe('mock.jwt.token');
    });

    it('should handle different payloads', async () => {
      const payload = {
        userId: 2,
        role: 'ADMIN' as UserRole,
        referralCode: 'MUMB87654321',
      };

      const token = await generateToken(payload);
      expect(token).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', async () => {
      const mockPayload = {
        userId: 1,
        role: 'USER' as UserRole,
        referralCode: 'MUMB12345678',
      };

      (jwtVerify as jest.Mock).mockResolvedValue({
        payload: mockPayload,
      });

      const decoded = await verifyToken('valid.jwt.token');
      
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(mockPayload.userId);
      expect(decoded?.role).toBe(mockPayload.role);
      expect(decoded?.referralCode).toBe(mockPayload.referralCode);
    });

    it('should return null for invalid token', async () => {
      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));
      
      const decoded = await verifyToken('invalid.token.here');
      expect(decoded).toBeNull();
      
      consoleErrorSpy.mockRestore();
    });

    it('should return null for empty token', async () => {
      const decoded = await verifyToken('');
      expect(decoded).toBeNull();
    });

    it('should return null for malformed token', async () => {
      const decoded = await verifyToken('not-a-jwt-token');
      expect(decoded).toBeNull();
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Authorization header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const authHeader = `Bearer ${token}`;
      
      const extracted = extractTokenFromHeader(authHeader);
      expect(extracted).toBe(token);
    });

    it('should return null for header without Bearer prefix', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const extracted = extractTokenFromHeader(token);
      expect(extracted).toBeNull();
    });

    it('should return null for null header', () => {
      const extracted = extractTokenFromHeader(null);
      expect(extracted).toBeNull();
    });

    it('should return null for empty header', () => {
      const extracted = extractTokenFromHeader('');
      expect(extracted).toBeNull();
    });
  });

  describe('extractTokenFromCookies', () => {
    it('should extract token from cookies string', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const cookies = `auth_token=${token}; other_cookie=value`;
      
      const extracted = extractTokenFromCookies(cookies);
      expect(extracted).toBe(token);
    });

    it('should extract token when auth_token is first', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const cookies = `auth_token=${token}`;
      
      const extracted = extractTokenFromCookies(cookies);
      expect(extracted).toBe(token);
    });

    it('should extract token when auth_token is last', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const cookies = `other_cookie=value; auth_token=${token}`;
      
      const extracted = extractTokenFromCookies(cookies);
      expect(extracted).toBe(token);
    });

    it('should return null if auth_token not found', () => {
      const cookies = 'other_cookie=value; another=test';
      const extracted = extractTokenFromCookies(cookies);
      expect(extracted).toBeNull();
    });

    it('should return null for null cookies', () => {
      const extracted = extractTokenFromCookies(null);
      expect(extracted).toBeNull();
    });

    it('should return null for empty cookies', () => {
      const extracted = extractTokenFromCookies('');
      expect(extracted).toBeNull();
    });
  });

  describe('hasRole', () => {
    it('should return true if user has required role', () => {
      const userRole = 'ADMIN' as UserRole;
      const requiredRoles = ['ADMIN' as UserRole, 'SUPER_ADMIN' as UserRole];
      
      expect(hasRole(userRole, requiredRoles)).toBe(true);
    });

    it('should return false if user does not have required role', () => {
      const userRole = 'USER' as UserRole;
      const requiredRoles = ['ADMIN' as UserRole, 'SUPER_ADMIN' as UserRole];
      
      expect(hasRole(userRole, requiredRoles)).toBe(false);
    });

    it('should return true if user role matches single required role', () => {
      const userRole = 'PARTNER' as UserRole;
      const requiredRoles = ['PARTNER' as UserRole];
      
      expect(hasRole(userRole, requiredRoles)).toBe(true);
    });

    it('should return false for empty required roles array', () => {
      const userRole = 'USER' as UserRole;
      const requiredRoles: UserRole[] = [];
      
      expect(hasRole(userRole, requiredRoles)).toBe(false);
    });
  });
});
