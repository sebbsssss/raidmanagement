# X (Twitter) API Setup Guide

This guide will help you configure X OAuth authentication for raiders to login with their X accounts.

## Step 1: Create X Developer Account

1. Go to [X Developer Portal](https://developer.twitter.com/)
2. Sign in with your X account
3. Apply for a developer account if you don't have one
4. Wait for approval (can take a few days)

## Step 2: Create a New App

1. Once approved, go to the "Projects & Apps" section
2. Click "Create App" or "New Project"
3. Fill in the required information:
   - **App Name**: X Raider Tracker
   - **Description**: Raider management system with X integration
   - **Website URL**: Your app's URL (e.g., `http://localhost:5173` for development)

## Step 3: Configure Authentication Settings

1. In your app settings, find "User authentication settings"
2. Click "Set up" or "Edit"
3. Configure the following:
   - **App permissions**: Select "Read" (or "Read and Write" if you need to post)
   - **Type of App**: Web App
   - **Callback URI**: `http://localhost:5173/auth/x/callback`
   - **Website URL**: `http://localhost:5173`

## Step 4: Get Your API Credentials

After setting up authentication, you'll get:
- **API Key** (Client ID)
- **API Key Secret** (Client Secret)
- **Bearer Token**

## Step 5: Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# X (Twitter) API Configuration
VITE_X_API_KEY=your_api_key_here
VITE_X_API_SECRET=your_api_secret_here
VITE_X_BEARER_TOKEN=your_bearer_token_here

# OAuth Configuration
VITE_X_CALLBACK_URL=http://localhost:5173/auth/x/callback
VITE_X_REDIRECT_URL=http://localhost:5173/dashboard

# App Configuration
VITE_APP_NAME=X Raider Tracker
```

## Step 6: Update Configuration

1. Open `src/config/xAuth.js`
2. Replace the placeholder values with your actual API credentials
3. Update the callback URLs if needed

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the login page
3. Select "Raider" login type
4. Click "Login with X Account"
5. You should be redirected to X for authorization

## Important Notes

### Security Considerations
- Never commit your API credentials to version control
- Use environment variables for all sensitive data
- In production, implement proper backend OAuth handling
- Consider using a backend service to handle OAuth tokens securely

### Production Deployment
- Update callback URLs for your production domain
- Use HTTPS in production
- Implement proper error handling
- Consider rate limiting and security measures

### Current Implementation
The current implementation is a **simulation** for development purposes. For production use, you'll need to:

1. Implement proper backend OAuth handling
2. Store access tokens securely
3. Implement proper error handling
4. Add user data validation

## Troubleshooting

### Common Issues
1. **"Invalid callback URL"**: Make sure your callback URL matches exactly in X app settings
2. **"App not approved"**: Wait for X developer account approval
3. **"Rate limit exceeded"**: Implement proper rate limiting
4. **"Invalid credentials"**: Double-check your API keys

### Development vs Production
- Development: Use `http://localhost:5173`
- Production: Use your actual domain with HTTPS

## Next Steps

1. Set up your X developer account
2. Create an app and get credentials
3. Configure environment variables
4. Test the OAuth flow
5. Implement backend handling for production

For more information, visit the [X API Documentation](https://developer.twitter.com/en/docs).
