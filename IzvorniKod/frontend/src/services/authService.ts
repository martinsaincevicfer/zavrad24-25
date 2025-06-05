import axios from 'axios';
import {LoginRequest, LoginResponse} from '../types/Auth.ts';
import {jwtDecode} from 'jwt-decode';

const backendUrl: string = import.meta.env.VITE_BACKEND_URL;

const API_URL: string = backendUrl + '/api/auth';

type DecodedToken = {
  roles?: string[];
  [key: string]: unknown;
};

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
  },

  getRoles(): string[] | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken.roles || [];
    }
    return null;
  },

  isUserInRole(role: string): boolean {
    const roles = this.getRoles();
    return roles ? roles.includes(role) : false;
  }
};