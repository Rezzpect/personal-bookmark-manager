import { Controller, Get, Query, Redirect, Res, Session } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import type { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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

  @Get('auth/logout')
  @Redirect()
  logout(@Session() session: Record<string, any>) {
    const redirectUrl = process.env.AUTH0_ISSUER + `v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(process.env.AUTH0_LOGOUT_URL ?? '/')}`;
    return { url: redirectUrl, statusCode: 302 };
  }

  @Public()
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const result = await this.authService.handleCallback(code, state, session);
    delete session.pkce_code_verifier;
    delete session.pkce_state;

    const idToken = result.id_token;
    if (idToken && typeof idToken === 'string') {
      res.cookie('id_token', idToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600000
      });
    }

    const redirectUrl = process.env.APP_URL ?? '/';
    return res.redirect(redirectUrl);
  }

  private sha256(value: string) {
    return createHash('sha256').update(value).digest();
  }

  private base64UrlEncode(value: Buffer) {
    return value.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
}
