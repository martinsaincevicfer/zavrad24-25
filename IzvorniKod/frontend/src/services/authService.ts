import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types/auth';

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.email);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): string | null {
    return localStorage.getItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};