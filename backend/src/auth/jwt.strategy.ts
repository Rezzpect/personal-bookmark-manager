import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { UserService } from '../models/user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.AUTH0_JWKS_URL ?? '',
      }),
      algorithms: ['RS256'],
      issuer: process.env.AUTH0_ISSUER,
      audience: process.env.AUTH0_CLIENT_ID,
    });
  }

  async validate(payload: { sub?: string; exp?: number; iat?: number; iss?: string; aud?: string | string[] }) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      throw new UnauthorizedException('Token expired');
    }

    if (!payload.iss || payload.iss !== process.env.AUTH0_ISSUER) {
      throw new UnauthorizedException('Invalid issuer');
    }

    const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audience.includes(process.env.AUTH0_CLIENT_ID ?? '')) {
      throw new UnauthorizedException('Invalid audience');
    }

    const user = await this.userService.findOne(payload.sub);
    return user;
  }
}

function cookieExtractor(req: Request): string | null {
  return req?.cookies?.['id_token'] ?? null;
}
