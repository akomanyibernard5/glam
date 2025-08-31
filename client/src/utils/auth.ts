import { User } from 'firebase/auth';

interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  token: string;
}

// Generate JWT-like token (for demo - in production use proper JWT library)
const generateToken = (user: User): string => {
  const payload = {
    uid: user.uid,
    email: user.email,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

// Validate token
export const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
};

// Store user with token
export const storeUser = (user: User) => {
  const token = generateToken(user);
  const authUser: AuthUser = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || undefined,
    token
  };
  localStorage.setItem('authUser', JSON.stringify(authUser));
  return authUser;
};

// Get stored user
export const getStoredUser = (): AuthUser | null => {
  const stored = localStorage.getItem('authUser');
  if (!stored) return null;
  
  const user = JSON.parse(stored);
  if (!isTokenValid(user.token)) {
    clearStoredUser();
    return null;
  }
  return user;
};

// Clear stored user
export const clearStoredUser = () => {
  localStorage.removeItem('authUser');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = getStoredUser();
  return !!user && isTokenValid(user.token);
};