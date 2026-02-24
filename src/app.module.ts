import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { DBModule } from 'src/modules/db/db.module';
import { BookmarkModule } from 'src/modules/bookmark/bookmark.module';
import { DestinationModule } from 'src/modules/destination/destination.module';
import { TravelDetailModule } from 'src/modules/travel-detail/travel-detail.module';
import { TripModule } from 'src/modules/trip/trip.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClerkSoftGuard } from '@guards/clerk/clerk.soft.guard';
import { DBInterceptor } from '@db/db.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TripModule,
    DestinationModule,
    TravelDetailModule,
    BookmarkModule,
    AuthModule,
    DBModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ClerkSoftGuard },
    { provide: APP_INTERCEPTOR, useClass: DBInterceptor },
  ],
})
export class AppModule {}
