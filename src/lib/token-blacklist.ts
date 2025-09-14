// Simple in-memory token blacklist for invalidated JWT tokens
// In production, this should be stored in Redis or a database

const blacklistedTokens = new Set<string>();

// Add token to blacklist (when user logs out)
export function blacklistToken(token: string) {
  console.log('🚫 [TOKEN_BLACKLIST] Adding token to blacklist');
  blacklistedTokens.add(token);
  
  // Clean up old tokens after 24 hours (optional)
  setTimeout(() => {
    blacklistedTokens.delete(token);
    console.log('🧹 [TOKEN_BLACKLIST] Cleaned up expired blacklisted token');
  }, 24 * 60 * 60 * 1000); // 24 hours
}

// Check if token is blacklisted
export function isTokenBlacklisted(token: string): boolean {
  const isBlacklisted = blacklistedTokens.has(token);
  if (isBlacklisted) {
    console.log('❌ [TOKEN_BLACKLIST] Token is blacklisted');
  }
  return isBlacklisted;
}

// Get blacklist size (for debugging)
export function getBlacklistSize(): number {
  return blacklistedTokens.size;
} 