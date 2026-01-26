import { HttpStatus } from '@nestjs/common';
import { CustomError } from '../error_codes';

export class CustomException extends Error {
  private readonly errMessage: string;

  private readonly status: HttpStatus;

  private readonly errorCode: number;

  private readonly data?: any;

  constructor(error: CustomError, data: any = null) {
    super(error.message);
    this.errMessage = error.message;
    this.status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    this.errorCode = error.code;
    this.data = data;
  }

  toJson() {
    return {
      statusCode: this.status,
      message: this.errMessage,
      errorCode: this.errorCode,
      data: this.data,
      timestamp: new Date().toISOString(),
    };
  }

  getErrMessage(): string {
    return this.errMessage;
  }

  getStatus(): HttpStatus {
    return this.status;
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  getData(): any {
    return this.data;
  }
}
