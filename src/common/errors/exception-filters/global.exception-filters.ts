import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomException } from '../exception/custom.exception.js';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof CustomException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody = {};

    if (exception instanceof CustomException) {
      responseBody = exception.toJson();
    } else if (exception instanceof HttpException) {
      responseBody = {
        statusCode: exception.getStatus(),
        message: exception.getResponse(),
        errorCode: null,
        data: null,
        timestamp: new Date().toISOString(),
      }
    } else {
      console.log(exception);
      responseBody = {
        statusCode: httpStatus,
        message: 'Something went wrong',
        errorCode: null,
        data: null,
        timestamp: new Date().toISOString(),
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
