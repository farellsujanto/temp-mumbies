/**
 * Email Masking Utility
 * Masks email addresses for privacy
 */

/**
 * Masks an email address
 * Example: john.doe@example.com -> jo***@example.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return '***';
  }

  const [localPart, domain] = email.split('@');
  
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  
  const visibleChars = Math.min(2, Math.floor(localPart.length / 3));
  const maskedLocal = localPart.substring(0, visibleChars) + '***';
  
  return `${maskedLocal}@${domain}`;
}
