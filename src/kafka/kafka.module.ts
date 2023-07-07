import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ProducerService } from './producer/kafkajs/producer.service';
import { ConsumerService } from './consumer/kafkajs/consumer.service';
import { Kafka, logLevel } from 'kafkajs';
import { KafkaModuleAsyncOptions, KafkaModuleOptions } from './interface';
import { KAFKA_CLIENT } from './constants';

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService]
})
export class KafkaModule {
  static forRoot(options: KafkaModuleOptions): DynamicModule {
    const kafka = new Kafka(options);
    return {
      module: KafkaModule,
      providers: [
        {
          provide: KAFKA_CLIENT,
          useValue: kafka
        },
        ProducerService, 
        ConsumerService
      ],
      exports: [ProducerService, ConsumerService]
    }
  }

  static forRootAsync(options: KafkaModuleAsyncOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: options.imports || [],
      providers: [
        {
          provide: KAFKA_CLIENT,
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        ProducerService, 
        ConsumerService
      ],
      exports: [ProducerService, ConsumerService]
    }
  }

  // static register(): DynamicModule {
  //   return {
  //     module: KafkaModule,
  //     providers: [ProducerService, ConsumerService],
  //     exports: [ProducerService, ConsumerService]
  //   }
  // }
}

// @Module({
//   providers: [ProducerService, ConsumerService],
//   exports: [ProducerService, ConsumerService]
// })
// export class KafkaModule {

//   static register(config: KafkaConfig): DynamicModule {
//     const kafka = new Kafka(config);

//     return {
//       module: KafkaModule,
//       providers: [
//         {
//           provide: KAFKA_CLIENT,
//           useValue: kafka,
//         },
//       ],
//       exports: [KAFKA_CLIENT],
//     };
//   }

//   static forRoot(broker: string): DynamicModule {

//     const kafka = new Kafka({
//       brokers: [broker],
//       logLevel: logLevel.INFO
//   })

//   const kafkaProvider: Provider = {
//     provide: KAFKA_CLIENT,
//     useValue: kafka
//   }
//     return {
//       module: KafkaModule,
//       providers: [kafkaProvider],
//       exports: [kafkaProvider],
//       global: true
//     }
//   }

// }
