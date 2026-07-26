import { Controller, Get, Query, Redirect, Req, Session } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('auth/login')
  @Redirect()
  login(@Session() session: Record<string, any>) {
    const state = randomBytes(16).toString('hex');
    const codeVerifier = randomBytes(32).toString('base64url');
    const codeChallenge = this.base64UrlEncode(this.sha256(codeVerifier));

    session.pkce_code_verifier = codeVerifier;
    session.pkce_state = state;

    const redirectUrl = this.authService.buildAuthorizationUrl(state, codeChallenge);
    return { url: redirectUrl, statusCode: 302 };
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') state: string, @Session() session: Record<string, any>) {
    const result = await this.authService.handleCallback(code, state, session);
    delete session.pkce_code_verifier;
    delete session.pkce_state;
    return result;
  }

  private sha256(value: string) {
    return createHash('sha256').update(value).digest();
  }

  private base64UrlEncode(value: Buffer) {
    return value.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
}
