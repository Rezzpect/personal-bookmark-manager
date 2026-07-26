import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		return (await super.canActivate(context)) as boolean;
	}

	handleRequest(err: any, user: any, info: any) {
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}
