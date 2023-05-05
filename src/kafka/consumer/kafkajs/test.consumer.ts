import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";

@Injectable()
export class TestConsumer implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService){}

    async onModuleInit() {
        await this.consumerService.consume({
            topic: { topics: ['test'] },
            config: {
                groupId: '[TestConsumer]: test-consumer',
            },
            onMessage: async (message) => {
                console.log('Received message', JSON.stringify({ message: message.value.toString() }));
                // throw new Error("TEST ERROR!!!!")
            }
        })
    }
}
