import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('KisanPeheleBootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'health', 'health/live', 'health/ready'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger / OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Kisan Pehele API')
    .setDescription('Farmer Procurement Transparency & Queue Intelligence Platform (SIH26032)\n\nTagline: "Pehle pata, phir mandi."')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Kisan Pehele')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🌾 Kisan Pehele API Server running on port ${port}`);
  logger.log(`📚 OpenAPI/Swagger documentation available at http://localhost:${port}/docs/api`);
}

bootstrap();
