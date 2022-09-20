import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  let config = new DocumentBuilder()
    .setTitle('магазин бу окон')
    .setDescription('документация апи')
    .setVersion('1.0.0')
    .addTag('buoknayar')
    .build();
  let document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(PORT, () =>
    console.log(`Server has been started on port - ${PORT}`),
  );
}
bootstrap();
