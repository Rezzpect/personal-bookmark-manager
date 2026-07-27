import { Controller, Get, Res } from '@nestjs/common';
import type {Response} from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  logoutCallback(@Res() res: Response) {
    const redirectUrl = process.env.APP_URL ?? '/';
    res.clearCookie('id_token',{
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600000
      });
    return res.redirect(redirectUrl);
  }
}
