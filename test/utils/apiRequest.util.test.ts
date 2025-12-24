/**
 * Unit tests for API Request Utility Functions
 */

import { setInMemoryToken, getInMemoryToken } from '@/src/utils/apiRequest.util';

describe('API Request Utility', () => {
  describe('Token Management', () => {
    beforeEach(() => {
      // Clear token before each test
      setInMemoryToken(null);
    });

    it('should set and get in-memory token', () => {
      const testToken = 'test-jwt-token-12345';
      
      setInMemoryToken(testToken);
      const retrievedToken = getInMemoryToken();
      
      expect(retrievedToken).toBe(testToken);
    });

    it('should return null when no token is set', () => {
      const token = getInMemoryToken();
      expect(token).toBeNull();
    });

    it('should update token when set multiple times', () => {
      const token1 = 'first-token';
      const token2 = 'second-token';
      
      setInMemoryToken(token1);
      expect(getInMemoryToken()).toBe(token1);
      
      setInMemoryToken(token2);
      expect(getInMemoryToken()).toBe(token2);
    });

    it('should clear token when set to null', () => {
      const testToken = 'test-token';
      
      setInMemoryToken(testToken);
      expect(getInMemoryToken()).toBe(testToken);
      
      setInMemoryToken(null);
      expect(getInMemoryToken()).toBeNull();
    });

    it('should handle empty string token', () => {
      setInMemoryToken('');
      expect(getInMemoryToken()).toBe('');
    });
  });
});
