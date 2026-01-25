import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Backend Playground API')
    .setDescription('Swagger API documentation for Backend Playground')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
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

  await app.listen(3000);
}
bootstrap();
