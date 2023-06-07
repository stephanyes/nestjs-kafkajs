import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConsumer } from './consumer.interface';
import { IKafkajsConsumerOptions } from './kafkajs-consumer-options-interface';
import { KafkajsConsumer } from './kafkajs.consumer';
import { KAFKA_CLIENT } from 'src/kafka/constants';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafka,
    private readonly configService: ConfigService,
  ) {}

  async consume({ topic, config, onMessage }: IKafkajsConsumerOptions) {
    try {
        // console.log("KAFKA IN CONSUMERSERVICE ", this.kafka)
        console.log("QUE kafka LLEGA ", this.kafka)
      const consumer = new KafkajsConsumer(
        topic,
        config,
        this.kafka,
        this.configService.get('KAFKA_BROKER'),
      );
      await consumer.connect();
      await consumer.consume(onMessage);
      this.consumers.push(consumer);
    } catch (error) {
      // handle error here, for example log it
      console.error(`Error consuming messages from topic ${topic.topics}:`, error);
    }
  }

  async onApplicationShutdown(signal?: string) {
    for (const consumer of this.consumers) {
      try {
        await consumer.disconnect();
      } catch (error) {
        // handle error here, for example log it
        console.error(`Error disconnecting consumer ${consumer}:`, error);
      }
    }
  }
}











// import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { IConsumer } from './consumer.interface';
// import { IKafkajsConsumerOptions } from './kafkajs-consumer-options-interface';
// import { KafkajsConsumer } from './kafkajs.consumer';
// import { KAFKA_CLIENT } from 'src/kafka/constants';

// @Injectable()
// export class ConsumerService implements OnApplicationShutdown {
//     private readonly consumers: IConsumer[] = [];

//     constructor(@Inject(KAFKA_CLIENT) private readonly kafka, private readonly configService: ConfigService) {}

//     async consume({ topic, config, onMessage }: IKafkajsConsumerOptions) {
//         // TODO KafkajsConsumer should receive more config options like ssl, sasl, etc
//         const consumer = new KafkajsConsumer(
//             topic, 
//             config, 
//             this.kafka,
//             this.configService.get(`KAFKA_BROKER`)
//         )
//         await consumer.connect();
//         await consumer.consume(onMessage)
//         this.consumers.push(consumer);
//     }

//     async onApplicationShutdown(signal?: string) {
//         for (const consumer of this.consumers) {
//             await consumer.disconnect();
//         }
//     }
// }
