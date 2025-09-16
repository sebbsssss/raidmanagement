// X (Twitter) OAuth Configuration
// You'll need to replace these with your actual X API credentials
// Get them from: https://developer.twitter.com/

export const X_AUTH_CONFIG = {
  // X API Credentials (get these from X Developer Portal)
  API_KEY: import.meta.env.VITE_X_API_KEY || 'JGZAGN1VIiwCEFFHeznU8hpgv',
  API_SECRET: import.meta.env.VITE_X_API_SECRET || 'BbrqFmiLb1C4GefKQ4M034fGqctgraeAxR46ntZEGqZWxv5ERr',
  BEARER_TOKEN: import.meta.env.VITE_X_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAKmT3QEAAAAAWhSKdtxFLclH%2FkWKfDxE9h0wHAk%3Dlh6tM2inuTqDipBte0Dr0ionkw0k0Kv7nWge0aE6loqXnf6cUd',
  
  // OAuth URLs
  AUTHORIZE_URL: 'https://api.twitter.com/oauth/authorize',
  REQUEST_TOKEN_URL: 'https://api.twitter.com/oauth/request_token',
  ACCESS_TOKEN_URL: 'https://api.twitter.com/oauth/access_token',
  
  // App Configuration
  CALLBACK_URL: import.meta.env.VITE_X_CALLBACK_URL || 'http://localhost:5173/auth/x/callback',
  REDIRECT_URL: import.meta.env.VITE_X_REDIRECT_URL || 'http://localhost:5173/dashboard',
  
  // OAuth Scopes
  SCOPES: ['tweet.read', 'users.read', 'offline.access'],
  
  // App Info
  APP_NAME: import.meta.env.VITE_APP_NAME || 'X Raider Tracker'
}

// Helper function to generate OAuth URL
export const generateXAuthURL = (requestToken) => {
  const params = new URLSearchParams({
    oauth_token: requestToken,
    oauth_callback: X_AUTH_CONFIG.CALLBACK_URL
  })
  
  return `${X_AUTH_CONFIG.AUTHORIZE_URL}?${params.toString()}`
}

// Helper function to get user info from X
export const getXUserInfo = async (accessToken, accessTokenSecret) => {
  try {
    // This would typically be done on your backend for security
    // For now, we'll simulate the user data
    return {
      id: 'x_user_' + Date.now(),
      username: 'raider_user',
      displayName: 'Raider User',
      profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xuser',
      verified: false,
      connectedX: true
    }
  } catch (error) {
    console.error('Error fetching X user info:', error)
    throw error
  }
}
