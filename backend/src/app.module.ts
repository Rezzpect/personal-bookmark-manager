import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './models/user/user.controller';
import { UserService } from './models/user/user.service';
import { CollectionController } from './models/collection/collection.controller';
import { CollectionService } from './models/collection/collection.service';
import { BookmarkController } from './models/bookmark/bookmark.controller';
import { BookmarkService } from './models/bookmark/bookmark.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController, UserController, CollectionController, BookmarkController],
  providers: [
    AppService,
    UserService,
    CollectionService,
    BookmarkService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
