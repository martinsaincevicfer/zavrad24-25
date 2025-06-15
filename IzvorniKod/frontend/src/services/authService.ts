import axios from 'axios';
import {LoginRequest, LoginResponse} from '../types/Auth.ts';
import {jwtDecode} from 'jwt-decode';

const backendUrl: string = import.meta.env.VITE_BACKEND_URL;
const API_URL: string = backendUrl + '/api/auth';

type DecodedToken = {
  roles?: string[];
  exp?: number;
  [key: string]: unknown;
};

export const authService = {
  notifyAuthChange(): void {
    window.dispatchEvent(new Event('authChanged'));
  },

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.email);
      this.notifyRoleChange();
      this.notifyAuthChange();
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.notifyRoleChange();
    this.notifyAuthChange();
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
  },

  getTokenExpiration(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      if (typeof decoded.exp === 'number') {
        return decoded.exp * 1000;
      }
    }
    return null;
  },

  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    return expiration ? Date.now() > expiration : true;
  },

  notifyRoleChange(): void {
    window.dispatchEvent(new Event('rolesChanged'));
  }
};