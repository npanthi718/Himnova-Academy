import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((res) => {
        // If the handler already returned a response with success flag or raw stream, pass it
        if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
          return res;
        }
        return {
          success: true,
          data: res,
        };
      })
    );
  }
}
