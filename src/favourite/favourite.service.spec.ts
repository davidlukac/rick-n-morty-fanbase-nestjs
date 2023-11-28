import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteService } from './favourite.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favourite } from './entities/favourite.entity';
import { EntityType } from './entities/entity-type.entity';

const mockFavouriteRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockEntyTypeRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('FavouriteService', () => {
  let service: FavouriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<FavouriteService>(FavouriteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
