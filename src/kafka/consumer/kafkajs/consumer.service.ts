import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConsumer } from './consumer.interface';
import { IKafkajsConsumerOptions } from './kafkajs-consumer-options-interface';
import { KafkajsConsumer } from './kaflajs.consumer';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    private readonly consumers: IConsumer[] = [];

    constructor(private readonly configService: ConfigService) {}

    async consume({ topic, config, onMessage }: IKafkajsConsumerOptions) {
        const consumer = new KafkajsConsumer(
            topic, 
            config, 
            this.configService.get(`KAFKA_BROKER`)
        )
        await consumer.connect();
        await consumer.consume(onMessage)
        this.consumers.push(consumer);
    }

    async onApplicationShutdown(signal?: string) {
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }
}
