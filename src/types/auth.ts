export interface AuthUser {
  createdAt: string;
  email: string;
  id: string;
  name: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface ApiErrorResponse {
  message: string;
}

export interface AuthUserResponse {
  user: AuthUser;
}
