import { Module } from '@nestjs/common';
import { DBModule } from '@modules/db/db.module';
import { RlsDebugController } from './rls-debug.controller';
import { RlsDebugService } from './rls-debug.service';

/**
 * RlsDebugModule
 *
 * Imports DBModule to get access to PG_POOL for raw query execution.
 * Registered in AppModule only when NODE_ENV !== 'production'.
 */
@Module({
  imports: [DBModule],
  controllers: [RlsDebugController],
  providers: [RlsDebugService],
})
export class RlsDebugModule {}
