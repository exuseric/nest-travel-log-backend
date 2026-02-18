import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './trip/trip.module';
import { DestinationModule } from './destination/destination.module';
import { TravelDetailModule } from './travel-detail/travel-detail.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { DB_CONN } from 'src/db/db';
import { DBModule } from 'src/db/db.module';

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
