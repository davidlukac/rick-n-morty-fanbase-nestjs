import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FavouriteModule } from './favourite/favourite.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityType } from './favourite/entities/entity-type.entity';
import { Favourite } from './favourite/entities/favourite.entity';
import { Review } from './review/entities/review.entity';
import { User } from '@user/entities/user.entity';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    FavouriteModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/database.db',
      entities: [EntityType, Favourite, Review, User],
      synchronize: true,
    }),
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
