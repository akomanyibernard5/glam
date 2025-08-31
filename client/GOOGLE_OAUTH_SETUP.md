# Google OAuth Setup Instructions

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Identity API

## 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: Your app name
   - User support email: Your email
   - Developer contact information: Your email

## 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain (when deploying)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain (when deploying)

## 4. Update Environment Variables

1. Copy your Client ID from the credentials page
2. Open `.env` file in your project root
3. Replace `your-google-client-id-here` with your actual Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id-here
   ```

## 5. Test the Integration

1. Start your development server: `npm start`
2. Navigate to `/auth` page
3. Click the Google sign-in button
4. Complete the OAuth flow
5. You should be redirected to the home page upon successful authentication

## Features Implemented

- ✅ Google OAuth sign-in button
- ✅ JWT token parsing
- ✅ User data storage in localStorage
- ✅ Automatic redirect to home page on success
- ✅ Authentication state management
- ✅ Sign-out functionality

## Security Notes

- The current implementation stores user data in localStorage for simplicity
- For production, consider using secure HTTP-only cookies
- Implement proper session management on your backend
- Add CSRF protection for enhanced security