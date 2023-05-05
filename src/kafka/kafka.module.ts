import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ProducerService } from './producer/kafkajs/producer.service';
import { ConsumerService } from './consumer/kafkajs/consumer.service';
import { Kafka, logLevel } from 'kafkajs';

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService]
})
export class KafkaModule {

  static register(): DynamicModule {
    return {
      module: KafkaModule,
      providers: [ProducerService, ConsumerService],
      exports: [ProducerService, ConsumerService]
    }
  }

  static forRoot(broker: string): DynamicModule {

    const kafka = new Kafka({
      brokers: [broker],
      logLevel: logLevel.INFO
  })

  const kafkaProvider: Provider = {
    provide: 'KAFKA_CLIENT',
    useValue: kafka
  }
    return {
      module: KafkaModule,
      providers: [kafkaProvider],
      exports: [kafkaProvider],
      global: true
    }
  }

}
