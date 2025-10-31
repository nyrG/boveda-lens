import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'; // 1. Import ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();

  // 1. Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // 2. Enable the global validation pipe
  // This enables global validation using class-validator DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that do not have any decorators
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  // 3. Setup Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Bóveda Lens API')
    .setDescription('API documentation for the Bóveda Lens medical records system.')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // The Swagger UI will be available under the global prefix, at /api/docs
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
