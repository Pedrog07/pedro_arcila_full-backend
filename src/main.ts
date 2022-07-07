import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  await app.listen(3000, () => {
    Logger.log(`Listening to port ${3000}`);
  });
}
bootstrap();
