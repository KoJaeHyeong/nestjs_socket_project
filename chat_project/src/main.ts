import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public')); // __dirname: 현재폴더, '..': 상위폴더
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const PORT = process.env.PORT;
  await app.listen(PORT);
  Logger.log(`http://localhost:${PORT}`, 'Server');
}
bootstrap();
