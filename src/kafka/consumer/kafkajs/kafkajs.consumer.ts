import { Logger } from "@nestjs/common";
import { Consumer, ConsumerConfig, ConsumerSubscribeTopics, Kafka, KafkaMessage, logLevel } from "kafkajs";
import { sleep } from "src/utils/sleep";
import { IConsumer } from "./consumer.interface";
import * as retry from 'async-retry';

export class KafkajsConsumer implements IConsumer {
    private readonly kafka: Kafka;
    private readonly consumer: Consumer;
    private readonly logger: Logger;

    constructor(
        private readonly topic: ConsumerSubscribeTopics,
        config: ConsumerConfig,
        broker: string
    ) {
        this.kafka = new Kafka({ brokers: [broker], logLevel: logLevel.INFO });
        this.consumer = this.kafka.consumer(config);
        this.logger = new Logger(`${topic.topics}-${config.groupId}`);
    }

    async connect(): Promise<void> {
        try {
            await this.consumer.connect(); // kafka js by default will retry 5 times
        } catch (error) {
            this.logger.error(`Failed to connect to Kafka`, error);
            await sleep(5000);
            await this.connect();
        }
    }

    async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }

    async consume(onMessage: (message: KafkaMessage) => Promise<void>): Promise<void> {
        await this.consumer.subscribe(this.topic);
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                this.logger.debug(`Processing message partition: ${partition}`);
                this.logger.log(`Received message`, JSON.stringify({ topic, partition, message: message.value.toString() }));
                try {
                    await retry(async () => onMessage(message), { retries: 3, onRetry: (error, attempt) => this.logger.error(`Error consuming message, executing retry ${attempt}/3`, error) });
                } catch (error) {
                    this.logger.error(`Error consuming message`, error)
                    // Do something with the message that we are not consuming?\
                    // add it to a dead letter queue?
                    // topic: this.topic
                    // message: message.value
                }
            }
        })
    }
    
}