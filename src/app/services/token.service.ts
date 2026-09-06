import { Injectable } from '@angular/core';

interface JwtPayload {
  sub?: string;
  exp?: number;

  role?: string | string[];

  // Common ASP.NET Core claim names
  nameid?: string;

  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;

  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?:
    string | string[];

  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly tokenKey = 'access_token';

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  private decodeToken(): JwtPayload | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const decodedPayload = decodeURIComponent(
        atob(payload)
          .split('')
          .map(char =>
            '%' +
            ('00' + char.charCodeAt(0).toString(16))
              .slice(-2)
          )
          .join('')
      );

      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Unable to decode JWT token', error);
      return null;
    }
  }

  getUserId(): string | null {
    const payload = this.decodeToken();

    if (!payload) {
      return null;
    }

    return (
      payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ] ??
      payload.nameid ??
      payload.sub ??
      null
    );
  }

  getRoles(): string[] {
    const payload = this.decodeToken();

    if (!payload) {
      return [];
    }

    const roles =
      payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] ??
      payload.role;

    if (!roles) {
      return [];
    }

    if (Array.isArray(roles)) {
      return roles;
    }

    return [roles];
  }

  getExpireTime(): Date | null {
    const payload = this.decodeToken();

    if (!payload?.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  }

  isTokenExpired(): boolean {
    const expireTime = this.getExpireTime();

    if (!expireTime) {
      return true;
    }

    return expireTime.getTime() <= Date.now();
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getRoles();

    return roles.some(role =>
      userRoles.includes(role)
    );
  }
}