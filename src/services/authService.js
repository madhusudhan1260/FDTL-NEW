import api, { USE_MOCK, mockResponse, mockError } from './api';

// Prototype-only credentials. Replace with POST /api/auth/login/.
const DEMO_USER = {
  email: 'admin@maddyaviation.com',
  password: 'admin123',
  profile: { name: 'Pranav TP', role: 'Operator Admin', email: 'admin@maddyaviation.com', initials: 'PT' },
};

export const DEMO_CREDENTIALS = { email: DEMO_USER.email, password: DEMO_USER.password };

export async function login(email, password) {
  if (USE_MOCK) {
    const valid = email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password;
    if (!valid) return mockError('Invalid email or password.', 600);
    return mockResponse({ token: 'mock-token', user: DEMO_USER.profile }, 600);
  }
  const { data } = await api.post('/auth/login/', { email, password });
  return data;
}

export async function requestPasswordReset(email) {
  if (USE_MOCK) return mockResponse({ detail: `Password reset link sent to ${email}.` }, 500);
  const { data } = await api.post('/auth/password-reset/', { email });
  return data;
}
