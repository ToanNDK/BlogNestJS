import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';// static file
import { NestExpressApplication } from '@nestjs/platform-express';// static file
import * as express from 'express'
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
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
});
  console.log(join(__dirname, '../../uploads'))//static file
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  app.use('/uploads', express.static('uploads'));
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
