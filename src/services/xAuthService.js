import { X_AUTH_CONFIG, generateXAuthURL, getXUserInfo } from '../config/xAuth.js'

class XAuthService {
  constructor() {
    this.requestToken = null
    this.requestTokenSecret = null
  }

  // Step 1: Initiate OAuth flow by getting request token
  async initiateAuth() {
    try {
      // For testing: Create a full local loop simulation
      console.log('🚀 Starting X OAuth simulation...')
      
      // Simulate getting request token
      this.requestToken = 'test_request_token_' + Date.now()
      this.requestTokenSecret = 'test_secret_' + Date.now()
      
      // Store in session storage for the callback
      sessionStorage.setItem('x_request_token', this.requestToken)
      sessionStorage.setItem('x_request_token_secret', this.requestTokenSecret)
      
      // Show a brief loading state
      console.log('📱 Redirecting to X authorization...')
      
      // Simulate X authorization page with a delay
      setTimeout(() => {
        // Simulate user clicking "Authorize" on X
        console.log('✅ User authorized the app on X')
        
        // Simulate the callback with mock parameters
        const mockCallbackURL = `${window.location.origin}${window.location.pathname}?oauth_token=${this.requestToken}&oauth_verifier=test_verifier_${Date.now()}`
        
        // Redirect to the mock callback
        window.location.href = mockCallbackURL
      }, 2000) // 2 second delay to simulate real OAuth flow
      
    } catch (error) {
      console.error('Error initiating X auth:', error)
      throw new Error('Failed to initiate X authentication')
    }
  }

  // Step 2: Handle OAuth callback (called when user returns from X)
  async handleCallback(oauthToken, oauthVerifier) {
    try {
      console.log('🔄 Handling X OAuth callback...')
      
      // Retrieve stored request token
      const storedRequestToken = sessionStorage.getItem('x_request_token')
      const storedRequestTokenSecret = sessionStorage.getItem('x_request_token_secret')
      
      if (!storedRequestToken || !oauthVerifier) {
        throw new Error('Invalid OAuth callback')
      }

      console.log('✅ OAuth tokens validated, exchanging for access tokens...')
      
      // Simulate exchanging verifier for access tokens
      const accessToken = 'test_access_token_' + Date.now()
      const accessTokenSecret = 'test_access_secret_' + Date.now()
      
      // Simulate getting user info from X API
      console.log('👤 Fetching user profile from X...')
      
      // Create realistic test user data
      const userInfo = {
        id: 'x_user_' + Date.now(),
        username: 'test_raider_' + Math.floor(Math.random() * 1000),
        displayName: 'Test Raider',
        profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=raider${Date.now()}`,
        verified: Math.random() > 0.7, // 30% chance of being verified
        connectedX: true,
        followersCount: Math.floor(Math.random() * 10000) + 100,
        followingCount: Math.floor(Math.random() * 5000) + 50
      }
      
      console.log('🎉 X OAuth flow completed successfully!', userInfo)
      
      // Clean up session storage
      sessionStorage.removeItem('x_request_token')
      sessionStorage.removeItem('x_request_token_secret')
      
      return {
        accessToken,
        accessTokenSecret,
        userInfo
      }
      
    } catch (error) {
      console.error('❌ Error handling X auth callback:', error)
      throw new Error('Failed to complete X authentication')
    }
  }

  // Check if we're in a callback scenario
  isCallback() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.has('oauth_token') && urlParams.has('oauth_verifier')
  }

  // Get callback parameters
  getCallbackParams() {
    const urlParams = new URLSearchParams(window.location.search)
    return {
      oauthToken: urlParams.get('oauth_token'),
      oauthVerifier: urlParams.get('oauth_verifier')
    }
  }

  // Clear URL parameters after handling callback
  clearCallbackParams() {
    const url = new URL(window.location)
    url.search = ''
    window.history.replaceState({}, document.title, url.pathname)
  }
}

export const xAuthService = new XAuthService()
