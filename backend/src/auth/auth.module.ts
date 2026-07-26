import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserService } from '../models/user/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
