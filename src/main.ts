import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';// static file
import { NestExpressApplication } from '@nestjs/platform-express';// static file

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);// static file
  const config = new DocumentBuilder()
  .setTitle('Blog APIs')
  .setDescription("List APIs ")
  .setVersion('1.0')
  .addTag('Auth')
  .addTag('Users')
  .addBearerAuth()
  .build();
  const documnent = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documnent);
  app.enableCors();
  console.log(join(__dirname, '../../uploads'))//static file
  app.useStaticAssets(join(__dirname, '../../uploads'));//static file
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
