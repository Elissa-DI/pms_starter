
import apiClient from './apiClient';
import type { User } from './types';

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  return user;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await apiClient.post('/auth/register', {
    name,
    email,
    password,
    role: 'CUSTOMER'
  });
  return response.data;
};

export const verifyEmail = async (email: string, otp: string) => {
  const response = await apiClient.post('/auth/verify-email', { email, otp });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/users/me');
  return response.data.user;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (
  otp: string,
  password: string
): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/reset-password', {
    token : otp,
    newPassword : password,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};
