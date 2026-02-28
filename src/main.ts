import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiConfig = new DocumentBuilder()
    .setTitle('Tripni API')
    .setDescription('The Tripni API description')
    .setVersion('0.0')
    .addBearerAuth()
    .build();

  const apiDocumentFactory = () => SwaggerModule.createDocument(app, apiConfig);
  SwaggerModule.setup('/', app, apiDocumentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
