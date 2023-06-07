import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TestConsumer } from './kafka/consumer/kafkajs/test.consumer';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaListenerInterceptor } from './kafka/interceptor/kafkajs/kafka.interceptor';
import { KafkajsConsumer } from './kafka/consumer/kafkajs/kafkajs.consumer';
console.log("PROCES ENV ", process.env.KAFKA_BROKER)
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    KafkaModule.forRoot({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: process.env.KAFKA_BROKER.split(","),
      retry: {
        initialRetryTime: 100,
        retries: 8
      },
      connectionTimeout: 1000,
      logLevel: process.env.KAFKA_LOG_LEVEL as any,
      // groupId: process.env.KAFKA_GROUP_ID,
    })
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    // TestConsumer,
    // KafkajsConsumer, // i cant just provide the kafkajsconsumer here because it is not a provider
    // Here my Interceptor is available GLOBALLY to all the application
    {
      provide: APP_INTERCEPTOR,
      useClass: KafkaListenerInterceptor,
    },
  ],
})
export class AppModule {}
