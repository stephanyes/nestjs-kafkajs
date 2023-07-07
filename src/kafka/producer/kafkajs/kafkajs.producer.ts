import { Logger } from "@nestjs/common";
import { Kafka, Message, Producer, logLevel } from "kafkajs";
import { sleep } from "src/utils/sleep";
import { IProducer } from "./producer.interface";

export class KafkajsProducer implements IProducer {
    private readonly kafka: Kafka;
    private readonly producer: Producer;
    private readonly logger: Logger;
    private sleepTime: number;

    // TODO cambiar la linea 15 no generar una nueva instancia de kafka
    // hacer como en el consumer e importarlo desde el modulo
    constructor( private readonly topic: string, broker: string, sleepTime: number = 5000) {
        const brokers = broker.split(",").map(b => b.trim())
        this.kafka = new Kafka({
            brokers: [...brokers],
            logLevel: logLevel.INFO
        })

        this.producer = this.kafka.producer();
        this.logger = new Logger(topic)
        this.sleepTime = sleepTime;
    }

    async produce(message: Message, retryCount = 0) {
        try {
            await this.producer.send({ topic: this.topic, messages: [message] }) // Aca se puede agregar un key para que los mensajes con la misma key vayan al mismo partition
        } catch (error) {
            if (retryCount < 5) {
                this.logger.error(`Failed attepmt to produce message to topic ${this.topic}. Retrying in ${this.sleepTime}ms...`, error)
                await sleep(this.sleepTime)
                await this.produce(message, retryCount + 1)
            } else {
                this.logger.error(`Failed to produce message to topic ${this.topic} after ${retryCount} attempts. Giving up.`, error)
                throw error;
            }
        }
    }

    async connect(retryCount = 0) {
        try {
          await this.producer.connect(); // kafka js by default will retry 5 times
        } catch (error) {
          if (retryCount < 5) {
            this.logger.error(`Failed to connect to Kafka. Retrying in ${this.sleepTime}ms...`, error);
            await sleep(this.sleepTime); // TODO maybe get this from .env? 
            await this.connect(retryCount + 1);
          } else {
            this.logger.error(`Failed to connect to Kafka after ${retryCount} attempts. Giving up.`, error);
            throw error; // You can choose to throw the error or handle it differently based on your requirements
          }
        }
      }

    async disconnect() {
        await this.producer.disconnect();
    }
}