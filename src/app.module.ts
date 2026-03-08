import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { DBModule } from '@modules/db/db.module';
import { BookmarkModule } from '@modules/bookmark/bookmark.module';
import { DestinationModule } from '@modules/destination/destination.module';
import { TravelDetailModule } from '@modules/travel-detail/travel-detail.module';
import { TripModule } from '@modules/trip/trip.module';
import { ClerkSoftGuard } from '@guards/clerk/clerk.soft.guard';
import { DBInterceptor } from '@db/db.interceptor';
import { GeneralCollectionModule } from '@modules/general-collection/general-collection.module';
import { RegionModule } from '@modules/region/region.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TripModule,
    DestinationModule,
    TravelDetailModule,
    BookmarkModule,
    AuthModule,
    DBModule,
    GeneralCollectionModule,
    RegionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ClerkSoftGuard },
    { provide: APP_INTERCEPTOR, useClass: DBInterceptor },
  ],
})
export class AppModule { }
