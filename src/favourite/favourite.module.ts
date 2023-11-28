import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from './entities/favourite.entity';
import { EntityType } from './entities/entity-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favourite, EntityType])],
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule {}
