import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
@ApiTags('Debug')
@Controller('debug/rls')
export class RlsDebugController {
  constructor(private readonly rlsDebugService: RlsDebugService) {}

  @Get('policy-exists')
  @ApiOperation({ summary: 'Check if RLS policy exists' })
  checkPolicyExists() {
    return this.rlsDebugService.checkPolicyExists();
  }

  @Get('rls-enabled')
  @ApiOperation({ summary: 'Check if RLS is enabled' })
  checkRlsEnabled() {
    return this.rlsDebugService.checkRlsEnabled();
  }

  @Get('test-unauthenticated')
  @ApiOperation({ summary: 'Test unauthenticated access' })
  testUnauthenticated() {
    return this.rlsDebugService.testUnauthenticatedAccess();
  }

  @Get('test-stranger/:ownerId')
  @ApiOperation({ summary: 'Test stranger access' })
  testStranger(@Param('ownerId') ownerId: string) {
    return this.rlsDebugService.testStrangerAccess(ownerId);
  }

  @Get('test-owner/:ownerId')
  @ApiOperation({ summary: 'Test owner access' })
  testOwner(@Param('ownerId') ownerId: string) {
    return this.rlsDebugService.testOwnerAccess(ownerId);
  }

  @Get('run-all')
  @ApiOperation({ summary: 'Run all RLS checks' })
  runAll(@Query('ownerId') ownerId?: string) {
    return this.rlsDebugService.runAllChecks(ownerId);
  }
}
