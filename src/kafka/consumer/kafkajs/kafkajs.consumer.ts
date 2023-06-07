import { Logger, HttpException, HttpStatus } from "@nestjs/common";
import { Consumer, ConsumerConfig, ConsumerSubscribeTopics, Kafka, KafkaMessage, logLevel } from "kafkajs";
import { sleep } from "src/utils/sleep";
import { IConsumer } from "./consumer.interface";
import * as retry from 'async-retry';

export class KafkajsConsumer implements IConsumer {
    private readonly client: Kafka;
    private readonly consumer: Consumer;
    private readonly logger: Logger;
    private maxRetries: number = 3;
    private sleepTime: number;

    constructor(
        private readonly topic: ConsumerSubscribeTopics,
        consumerConfig: ConsumerConfig,
        client: Kafka,
        broker: string,
        maxRetries: number = 3,
        sleepTime: number = 5000
    ) {
        // this.kafka = new Kafka({ brokers: [broker], logLevel: logLevel.INFO });
        console.log("CONSUMER CONFIG ", consumerConfig)
        this.client = client;
        console.log("KAFKA ", this.client)
        this.consumer = this.client.consumer(consumerConfig);
        this.logger = new Logger(`${topic.topics}-${consumerConfig.groupId}`);
        this.maxRetries = maxRetries;
        this.sleepTime = sleepTime;
    }

    async connect(): Promise<void> {
        try {
            await this.consumer.connect(); // kafka js by default will retry 5 times
        } catch (error) {
            this.logger.error(`Failed to connect to Kafka`, error);
            await sleep(this.sleepTime);
            await this.connect();
        }
    }

    async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }

    async consume(onMessage: (message: KafkaMessage) => Promise<void>): Promise<void> {
        await this.consumer.subscribe(this.topic);
        // const {HEARTBEAT}  = this.consumer.events // instrumentation events doc -> https://kafka.js.org/docs/instrumentation-events
        // console.log("HEATBEAT ", HEARTBEAT)
        // todo CAMBAR EACHMESSAGE POR EACHBATCH Y VER COMO SE COMPORTA
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                this.logger.debug(`Processing message partition: ${partition}`);
                this.logger.log(`Received message`, JSON.stringify({ topic, partition, message: message.value.toString() }));
                try {
                    // we'll try to consume the message 3 times before giving up
                    await retry(async () => onMessage(message), { retries: this.maxRetries, onRetry: (error, attempt) => this.logger.error(`Error consuming message, executing retry ${attempt}/${this.maxRetries}`, error) });
                } catch (error: any) { // this is not OK hay que ver como hacer para que no sea any y poder catchear el error de too many requests
                    if (error.name === HttpStatus.TOO_MANY_REQUESTS) {

                    }
                    this.logger.error(`Error consuming message`, error)
                    this.logger.error(`Message lost: ${message.value.toString()}`)
                    
                    // Do something with the message that we are not consuming?\
                    // add it to a dead letter queue?
                    // topic: this.topic
                    // message: message.value

                    /**
                     * Enviar a un topic de errores: Puedes redirigir los mensajes que generan errores a un topic de errores separado. 
                     * Esto te permite separar los mensajes fallidos del flujo principal y tomar acciones específicas para manejarlos. 
                     * Por ejemplo, puedes tener un consumidor dedicado que se encargue de procesar los mensajes del topic de errores 
                     * o enviar notificaciones sobre los errores.
                     */
                }
            }
        })
    }
    
}