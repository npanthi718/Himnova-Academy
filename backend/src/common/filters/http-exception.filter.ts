import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP_EXCEPTION');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errorMessage = 'An unexpected internal error occurred. Please try again later.';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        errorMessage = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as any;
        errorCode = obj.error?.code || obj.code || obj.error || 'HTTP_ERROR';
        errorMessage = obj.error?.message || obj.message || exception.message;
        details = obj.message instanceof Array ? obj.message : obj.details || null;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      this.logger.error(`Unhandled Exception at ${request.method} ${request.url}`, exception.stack);
    }

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        details,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
