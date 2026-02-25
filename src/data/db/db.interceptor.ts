import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DBService } from '@modules/db/db.service';

@Injectable({ scope: Scope.REQUEST })
export class DBInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DBInterceptor.name);

  constructor(private dbService: DBService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const release = () => {
      this.dbService.release().catch((err) => {
        this.logger.error('Failed to release DB connection', err);
      });
    };

    return next.handle().pipe(
      tap({
        next: release,
        error: release,
      }),
    );
  }
}
