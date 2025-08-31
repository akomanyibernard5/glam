const API_BASE = 'http://localhost:3001';

interface AuthResponse {
  token: string;
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
}

// Send Firebase ID token to backend for JWT
export const authenticateWithBackend = async (idToken: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  return response.json();
};

// Verify JWT token with backend
export const verifyToken = async (token: string) => {
  const response = await fetch(`${API_BASE}/auth/verify`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  return response.json();
};

// Logout from backend
export const logoutFromBackend = async (token: string) => {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.ok;
};