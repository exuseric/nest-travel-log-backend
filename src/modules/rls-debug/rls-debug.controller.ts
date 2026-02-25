import { Controller, Get, Param, Query } from '@nestjs/common';
import { RlsDebugService } from './rls-debug.service';

/**
 * RlsDebugController
 *
 * Exposes manual RLS verification endpoints.
 * Only registered in non-production via AppModule guard.
 *
 * Routes:
 *   GET /debug/rls/policy-exists
 *   GET /debug/rls/rls-enabled
 *   GET /debug/rls/test-unauthenticated
 *   GET /debug/rls/test-stranger/:ownerId
 *   GET /debug/rls/test-owner/:ownerId
 *   GET /debug/rls/run-all?ownerId=<clerk_user_id>
 */
@Controller('debug/rls')
export class RlsDebugController {
  constructor(private readonly rlsDebugService: RlsDebugService) {}

  @Get('policy-exists')
  checkPolicyExists() {
    return this.rlsDebugService.checkPolicyExists();
  }

  @Get('rls-enabled')
  checkRlsEnabled() {
    return this.rlsDebugService.checkRlsEnabled();
  }

  @Get('test-unauthenticated')
  testUnauthenticated() {
    return this.rlsDebugService.testUnauthenticatedAccess();
  }

  @Get('test-stranger/:ownerId')
  testStranger(@Param('ownerId') ownerId: string) {
    return this.rlsDebugService.testStrangerAccess(ownerId);
  }

  @Get('test-owner/:ownerId')
  testOwner(@Param('ownerId') ownerId: string) {
    return this.rlsDebugService.testOwnerAccess(ownerId);
  }

  @Get('run-all')
  runAll(@Query('ownerId') ownerId?: string) {
    return this.rlsDebugService.runAllChecks(ownerId);
  }
}
