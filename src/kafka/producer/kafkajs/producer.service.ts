import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { Message } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { IProducer } from './producer.interface';
import { KafkajsProducer } from './kafkajs.producer';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
    private readonly producers = new Map<string, IProducer>();

    constructor(private readonly configService: ConfigService) {}

    async produce(topic: string, message: Message) {
        const producer = await this.getProducer(topic);
        await producer.produce(message);
    }

    async getProducer(topic: string) {
        let producer = this.producers.get(topic);
        if (!producer) {
            producer = new KafkajsProducer(topic, this.configService.get<string>('KAFKA_BROKER'));
            await producer.connect();
            this.producers.set(topic, producer);
        }
        return producer;
    }

    async onApplicationShutdown(signal?: string) {
        for(const producer of this.producers.values()) {
            await producer.disconnect();
        }
    }
}
