import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer/kafkajs/producer.service';
import { ConsumerService } from './kafka/consumer/kafkajs/consumer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
    private readonly configService: ConfigService
    ) {}

 async getHello()  {
    await this.producerService.produce('test', { value: 'Hello KafkaJS user!' });
    return 'Hello World!';
  }

  // async listenForMessages() {
  //   await this.consumerService.consume({
  //     topic: { topics: ['test'] },
  //     config: {
  //         groupId: 'test-consumer',
  //     },
  //     onMessage: async (message) => {
  //         console.log('listenForMessages() ->', JSON.stringify({ message: message.value.toString() }));
  //         // throw new Error("TEST ERROR!!!!")
  //     }
  // })
    // await this.consumerService.consume(
    //   'kafka-listenForMessages',
    //   { topics: ['test'], fromBeginning: true },
    //   {
    //     eachMessage: async ({ topic, partition, message }) => {
    //       console.log('Received message from APP SERVICE listenForMessages:', {
    //         value: message.value.toString(),
    //         topic: topic.toString(),
    //         partition: partition.toString(),
    //       });
    //     },
    //   },
    // );
}
