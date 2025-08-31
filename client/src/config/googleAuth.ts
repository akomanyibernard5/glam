// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id-here';

export const googleAuthConfig = {
  client_id: GOOGLE_CLIENT_ID,
  callback: handleGoogleCallback,
  auto_select: false,
  cancel_on_tap_outside: true,
};

// Handle Google OAuth callback
export function handleGoogleCallback(response: any) {
  try {
    // Decode the JWT token to get user info
    const userInfo = parseJwt(response.credential);
    
    // Store user info in localStorage (you might want to use a more secure method)
    localStorage.setItem('user', JSON.stringify({
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      isAuthenticated: true
    }));
    
    // Redirect to home page
    window.location.href = '/';
    
  } catch (error) {
    console.error('Google OAuth error:', error);
  }
}

// Parse JWT token
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

// Initialize Google OAuth
export function initializeGoogleAuth() {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.initialize(googleAuthConfig);
  }
}

// Sign out function
export function signOut() {
  localStorage.removeItem('user');
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.disableAutoSelect();
  }
}

// Check if user is authenticated
export function isAuthenticated() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).isAuthenticated : false;
}

// Get current user
export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}