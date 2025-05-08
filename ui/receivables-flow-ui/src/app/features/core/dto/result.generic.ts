import { HttpStatusCode } from 'axios';

export class Result<T> {
  public isSuccess: boolean;
  public error?: string;
  public data?: T;
  public statusCode: HttpStatusCode;

  constructor(
    isSuccess: boolean,
    error: string | undefined,
    data: T | undefined,
    statusCode: HttpStatusCode,
  ) {
    this.isSuccess = isSuccess;
    this.error = error;
    this.data = data;
    this.statusCode = statusCode;
  }

  public static success<T>(
    value: T,
    statusCode: HttpStatusCode = HttpStatusCode.Ok,
  ): Result<T> {
    return new Result<T>(true, undefined, value, statusCode);
  }

  public static failure<T>(
    error: string,
    statusCode: HttpStatusCode = HttpStatusCode.BadRequest,
  ): Result<T> {
    return new Result<T>(false, error, undefined, statusCode);
  }
}
