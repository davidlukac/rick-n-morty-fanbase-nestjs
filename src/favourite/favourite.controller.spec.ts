import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { Favourite } from './entities/favourite.entity';
import { EntityType } from './entities/entity-type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockFavouriteRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockEntyTypeRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('FavouriteController', () => {
  let controller: FavouriteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouriteController],
      providers: [
        FavouriteService,
        {
          provide: getRepositoryToken(Favourite),
          useValue: mockFavouriteRepository,
        },
        {
          provide: getRepositoryToken(EntityType),
          useValue: mockEntyTypeRepository,
        },
      ],
    }).compile();

    controller = module.get<FavouriteController>(FavouriteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
