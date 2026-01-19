// jwt-payload.interface.ts
export interface JwtPayload {
  sub: string; // userId (standard claim)
  email: string;
}