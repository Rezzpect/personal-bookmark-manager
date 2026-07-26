import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  buildAuthorizationUrl(state: string, codeChallenge: string) {
    const authorizationUrl = process.env.AUTH0_AUTHORIZATION_URL;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const redirectUri = process.env.AUTH0_CALLBACK_URL;
    const scope = 'openid profile email';
    const responseType = 'code';

    if (!authorizationUrl || !clientId || !redirectUri) {
      throw new Error('OIDC environment variables are not configured');
    }

    const params = new URLSearchParams({
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${authorizationUrl}?${params.toString()}`;
  }

  async handleCallback(code: string, state: string, session: Record<string, unknown>) {
    const issuer = process.env.AUTH0_ISSUER;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const redirectUri = process.env.AUTH0_CALLBACK_URL;
    const tokenUrl = process.env.AUTH0_TOKEN_URL;

    if (!code || !state || !issuer || !clientId || !redirectUri || !tokenUrl) {
      throw new Error('Missing OIDC callback parameters');
    }

    const savedVerifier = session.pkce_code_verifier;
    const savedState = session.pkce_state;

    if (!savedVerifier || typeof savedVerifier !== 'string' || !savedState || typeof savedState !== 'string' || savedState !== state) {
      throw new Error('Invalid PKCE state or verifier');
    }

    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          code,
          redirect_uri: redirectUri,
          code_verifier: savedVerifier,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ),
    );

    const tokens = tokenResponse.data as {
      id_token?: string;
      access_token?: string;
      refresh_token?: string;
    };

    if (!tokens.id_token) {
      throw new Error('No ID token returned from identity provider');
    }

    const payload = this.decodeJwtPayload(tokens.id_token);
    const sub = payload.sub as string | undefined;
    const email = (payload.email as string | undefined) ?? null;
    const name = (payload.name as string | undefined) ?? null;

    if (!sub) {
      throw new Error('OIDC subject missing from ID token');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: sub },
    });

    const user = existingUser ?? await this.prisma.user.create({
      data: {
        id: sub,
        email: email ?? null,
        name: name ?? null,
      },
    });

    return {
      message: 'Authenticated',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens,
      state,
    };
  }

  private decodeJwtPayload(token: string) {
    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid JWT format');
    }

    const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
    return JSON.parse(payload);
  }
}
