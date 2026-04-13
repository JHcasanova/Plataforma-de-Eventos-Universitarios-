import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuración de CORS
  app.enableCors();

  // Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('Plataforma de Eventos Universitarios')
    .setDescription('API REST para gestión de eventos universitarios')
    .setVersion('1.0')
    .build();
  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documento);

  const puerto = process.env.PORT ?? 3001;
  await app.listen(puerto);
  console.log(`API ejecutándose en: http://localhost:${puerto}`);
  console.log(`Documentación Swagger: http://localhost:${puerto}/api`);
}

bootstrap();
