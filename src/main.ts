import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaExceptionFilter } from './kafka/interceptor/kafkajs/filters.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new KafkaExceptionFilter())
  await app.listen(3000);
}
bootstrap();
