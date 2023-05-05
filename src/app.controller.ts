import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ListenToTopic } from './kafka/decorator/listen.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // Because i have it globally available, i can use it here
  @ListenToTopic('test')
  getHello() {
    return this.appService.getHello();
  }

  @Get('/hello')
  @ListenToTopic('getHello2')
  getHello2() {
    return "Hello world 2";
  }
}
