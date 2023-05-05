import { SetMetadata } from '@nestjs/common';

export const ListenToTopic = (topic: string) => SetMetadata('listenToTopic', topic);
