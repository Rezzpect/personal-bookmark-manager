import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  async me(@Req() req: Request & { user: { id?: string } }) {
    if (!req.user?.id) {
      throw new Error('No authenticated user');
    }

    return this.userService.findOne(req.user?.id);
  }

  @Put('users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
