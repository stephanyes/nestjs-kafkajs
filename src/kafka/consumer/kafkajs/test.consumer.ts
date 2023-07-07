import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";

@Injectable()
export class TestConsumer implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService){}

    async onModuleInit() {
        await this.consumerService.consume({
            topic: { topics: ['test'] },
            config: {
                groupId: 'TEST-CONSUMER',
            },
            onMessage: async (message) => {
                console.log('Received message test-Consumer', JSON.stringify({ message: message.value.toString() }));
                // throw new Error("TEST ERROR!!!!")
            }
        })
    }
}
