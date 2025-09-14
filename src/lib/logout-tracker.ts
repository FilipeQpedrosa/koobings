// Client-side logout tracking system
// This works better in serverless environments than server-side blacklists

export function markUserAsLoggedOut(userEmail: string) {
  const logoutTime = Date.now();
  console.log('🚫 [LOGOUT_TRACKER] Marking user as logged out:', userEmail, 'at', logoutTime);
  
  // Store logout timestamp in localStorage
  localStorage.setItem(`logout_${userEmail}`, logoutTime.toString());
  
  // Also store a global logout flag
  localStorage.setItem('user_logged_out', 'true');
  localStorage.setItem('logout_timestamp', logoutTime.toString());
}

export function isUserLoggedOut(userEmail: string): boolean {
  try {
    // Check user-specific logout
    const userLogoutTime = localStorage.getItem(`logout_${userEmail}`);
    if (userLogoutTime) {
      console.log('❌ [LOGOUT_TRACKER] User was logged out at:', userLogoutTime);
      return true;
    }
    
    // Check global logout flag
    const globalLogout = localStorage.getItem('user_logged_out');
    if (globalLogout === 'true') {
      console.log('❌ [LOGOUT_TRACKER] Global logout flag detected');
      return true;
    }
    
    return false;
  } catch (error) {
    // localStorage might not be available
    console.log('⚠️ [LOGOUT_TRACKER] localStorage not available:', error);
    return false;
  }
}

export function clearLogoutState(userEmail?: string) {
  console.log('🧹 [LOGOUT_TRACKER] Clearing logout state for login');
  
  // Clear global logout flags
  localStorage.removeItem('user_logged_out');
  localStorage.removeItem('logout_timestamp');
  
  // Clear user-specific logout if email provided
  if (userEmail) {
    localStorage.removeItem(`logout_${userEmail}`);
  }
  
  // Clear all logout flags (brute force cleanup)
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('logout_')) {
      localStorage.removeItem(key);
    }
  });
} 