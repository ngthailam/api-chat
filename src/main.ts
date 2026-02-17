import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { CatchEverythingFilter } from './common/errors/exception-filters/global.exception-filters.js';
import { AppDataSource } from './common/database/typeorm.config.js';

await AppDataSource.initialize();
import './queue/poll-message/poll-message.worker.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Backend Playground API')
    .setDescription('Swagger API documentation for Backend Playground')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .addGlobalParameters({
      name: 'x-device-id',
      in: 'header',
      description: 'Deivce id',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Enable CORS for Flutter web development
  app.enableCors({ origin: true });
  app.use(
    helmet({
      contentSecurityPolicy: false, // usually off for APIs
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

  await app.listen(3000);
}
bootstrap();
