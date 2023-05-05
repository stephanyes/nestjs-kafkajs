import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TestConsumer } from './kafka/consumer/kafkajs/test.consumer';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaListenerInterceptor } from './kafka/interceptor/kafkajs/kafka.interceptor';

@Module({
  imports: [
    KafkaModule.forRoot(process.env.KAFKA_BROKER),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    TestConsumer,
    // Here my Interceptor is available GLOBALLY to all the application
    {
      provide: APP_INTERCEPTOR,
      useClass: KafkaListenerInterceptor,
    },
  ],
})
export class AppModule {}
