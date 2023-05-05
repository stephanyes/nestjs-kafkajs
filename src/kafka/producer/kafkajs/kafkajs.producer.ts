import { Logger } from "@nestjs/common";
import { Kafka, Message, Producer, logLevel } from "kafkajs";
import { sleep } from "src/utils/sleep";
import { IProducer } from "./producer.interface";

export class KafkajsProducer implements IProducer {
    private readonly kafka: Kafka;
    private readonly producer: Producer;
    private readonly logger: Logger;

    constructor( private readonly topic: string, broker: string) {
        this.kafka = new Kafka({
            brokers: [broker],
            logLevel: logLevel.INFO
        })

        this.producer = this.kafka.producer();
        this.logger = new Logger(topic)
    }

    async produce(message: Message) {
        await this.producer.send({ topic: this.topic, messages: [message] })
    }

    async connect() {
        try {
            await this.producer.connect(); // kafka js by default will retry 5 times
        } catch (error) {
            this.logger.error(`Failed to connect to Kafka`, error);
            await sleep(5000); // TODO maybe get this from .env? 
            await this.connect();
        }
    }

    async disconnect() {
        await this.producer.disconnect();
    }
}