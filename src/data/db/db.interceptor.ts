import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DbService } from '@modules/db/db.service';

@Injectable({ scope: Scope.REQUEST })
export class DbInterceptor implements NestInterceptor {
  constructor(private dbService: DbService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const release = () => {
      void this.dbService.release();
    };

    return next.handle().pipe(
      tap({
        next: release,
        error: release,
      }),
    );
  }
}