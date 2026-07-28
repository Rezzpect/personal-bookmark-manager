import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'dev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: false },
    })
  );

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.APP_URL,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
