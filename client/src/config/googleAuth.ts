
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id-here';

export const googleAuthConfig = {
  client_id: GOOGLE_CLIENT_ID,
  callback: handleGoogleCallback,
  auto_select: false,
  cancel_on_tap_outside: true,
};


export function handleGoogleCallback(response: any) {
  try {
    
    const userInfo = parseJwt(response.credential);
    
    
    localStorage.setItem('user', JSON.stringify({
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      isAuthenticated: true
    }));
    
    
    window.location.href = '/';
    
  } catch (error) {
    console.error('Google OAuth error:', error);
  }
}


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


export function initializeGoogleAuth() {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.initialize(googleAuthConfig);
  }
}


export function signOut() {
  localStorage.removeItem('user');
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.disableAutoSelect();
  }
}


export function isAuthenticated() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).isAuthenticated : false;
}


export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}