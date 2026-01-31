/** User (aligned with frontend) */
export interface User {
  id: string;
  username: string;
  permissions?: string[];
}

/** Login body */
export interface LoginPayload {
  username: string;
  password: string;
}

/** JWT payload stored in token */
export interface JwtPayload {
  sub: string;
  username: string;
  permissions?: string[];
}
