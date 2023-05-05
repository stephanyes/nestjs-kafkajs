import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { ConsumerService } from '../../consumer/kafkajs/consumer.service';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class KafkaListenerInterceptor implements NestInterceptor {
    constructor(
      private readonly consumerService: ConsumerService,
      private readonly reflector: Reflector,
    ) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const handler = context.getHandler();
      const topic = this.reflector.get<string>('listenToTopic', handler);
      console.log("TOPIC INTERCEPTOR -> ", topic)
      // Have in mind that if the topic doesn't exist the code below is creating a new topic
      // since we are consuming from a topic that doesn't exist
      if (topic) {
        this.consumerService
          .consume({
            topic: { topics: [topic]},
            config: {
              groupId: '[Interceptor]: test-consumer',
            },
            onMessage: async (message) => {
                console.log('Received message', JSON.stringify({ message: message.value.toString() }));
            }
          })
          .catch((error) => console.error(error));
      }
      return next.handle();
    }
  }
  