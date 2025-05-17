export interface LoginDto {
  userName: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  userName: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export interface AuthResponseDto {
  token: string;
}
