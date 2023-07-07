import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { KafkaException } from '../../exceptions';

@Catch(KafkaException)
export class KafkaExceptionFilter implements ExceptionFilter {
  catch(exception: KafkaException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Customize the error response or perform additional actions
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
      error: 'Kafka Error',
    });
  }
}
