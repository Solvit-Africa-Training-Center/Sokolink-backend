import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
      role?: string;
      permissions?: string[];
      iat?: number;
      exp?: number;
    }
    interface IRequestUser  {
      user?: User;
      token?: string;
    }
  }
}