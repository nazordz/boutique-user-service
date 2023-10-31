interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface RefreshTokenRequest {
  refresh_token: string;
}

interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
}