export interface LoginRequest {
  email: string;
  lozinka: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}