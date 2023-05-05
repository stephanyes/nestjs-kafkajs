import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from "kafkajs";

export interface IKafkajsConsumerOptions {
    topic: ConsumerSubscribeTopics;
    config: ConsumerConfig;
    onMessage: (message: KafkaMessage) => Promise<void>;
}