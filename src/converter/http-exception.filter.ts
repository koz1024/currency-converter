import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = exception.getResponse() as { statusCode: number; message: string[]; error: string };

    response.status(400).json({
      error: `${errorResponse.error}: ${errorResponse.message.join(', ')}`,
    });
  }
}
