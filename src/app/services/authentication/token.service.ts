import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() { }

  // Set access and refresh tokens
  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    localStorage.setItem("refresh", refreshToken);
    this.refreshToken = refreshToken;
  }

  // Get the access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Get the refresh token
  getRefreshToken(): string | null {
    return this.refreshToken || localStorage.getItem("refresh");
  }

  // Clear the tokens
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }  
}
