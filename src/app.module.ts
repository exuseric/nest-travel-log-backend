import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { DBModule } from 'src/db/db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookmarkModule } from './bookmark/bookmark.module';
import { DestinationModule } from './destination/destination.module';
import { TravelDetailModule } from './travel-detail/travel-detail.module';
import { TripModule } from './trip/trip.module';

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
  providers: [AppService],
})
export class AppModule {}
