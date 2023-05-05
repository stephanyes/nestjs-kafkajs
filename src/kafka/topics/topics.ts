import { Kafka, Admin, KafkaConfig } from "kafkajs";

export async function getTopics(config: KafkaConfig) {
    const kafka = new Kafka(config);
    const admin: Admin = kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    await admin.disconnect();
    return topics;
}

export async function createTopic(config: KafkaConfig, topic: string, numPartitions = 1) {
    const kafka = new Kafka(config);
    const admin: Admin = kafka.admin();
    await admin.connect();
  
    const topicExists = await admin.listTopics().then((topics) => topics.includes(topic));
  
    if (!topicExists) {
      await admin.createTopics({
        topics: [
          {
            topic,
            numPartitions,
          },
        ],
      });
    } else {
      console.log(`Topic ${topic} already exists`);
    }
  
    await admin.disconnect();
  }
  