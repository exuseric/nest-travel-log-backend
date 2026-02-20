import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { DBModule } from 'src/modules/db/db.module';
import { BookmarkModule } from 'src/modules/bookmark/bookmark.module';
import { DestinationModule } from 'src/modules/destination/destination.module';
import { TravelDetailModule } from 'src/modules/travel-detail/travel-detail.module';
import { TripModule } from 'src/modules/trip/trip.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
