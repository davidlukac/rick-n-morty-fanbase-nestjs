import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';

const mockReviewRepository = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('ReviewService', () => {
  let service: ReviewService;
  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockReviewRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should retrieve a specific review', async () => {
      const reviewId = 1;
      const mockReview = { id: reviewId, text: 'Great episode', rating: 4.5, userId: userId };

      mockReviewRepository.findOne.mockResolvedValue(mockReview);

      const result = await service.findOne(userId, reviewId);
      expect(result).toEqual(mockReview);
      expect(mockReviewRepository.findOne).toHaveBeenCalledWith({
        relations: ['user'],
        where: { user: { id: userId }, id: reviewId },
      });
    });

    it('should throw NotFoundExceptions if review is not found', async () => {
      const reviewId = 9999;

      mockReviewRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(userId, reviewId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should successfully create a new review', async () => {
      const reviewData = { episodeId: 1, text: 'Amazing!', rating: 5 };
      const reviewDataDto = new CreateReviewDto();
      Object.assign(reviewDataDto, reviewData);
      const savedReview = { id: 2, ...reviewData };

      mockReviewRepository.create.mockReturnValue({ ...reviewDataDto, user: { id: userId } });
      mockReviewRepository.save.mockResolvedValue(savedReview);

      const result = await service.create(userId, reviewDataDto);
      expect(result).toEqual(savedReview);
      expect(mockReviewRepository.create).toHaveBeenCalledWith({ ...reviewDataDto, user: { id: userId } });
      expect(mockReviewRepository.save).toHaveBeenCalledWith({ ...reviewDataDto, user: { id: userId } });
    });

    it('should fail to create a new review if it already exists', async () => {
      const reviewData = { episodeId: 1, text: 'Amazing!', rating: 5 };
      const reviewDataDto = new CreateReviewDto();
      Object.assign(reviewDataDto, reviewData);

      mockReviewRepository.create.mockReturnValue({ ...reviewDataDto, user: { id: userId } });
      mockReviewRepository.save.mockImplementation(() => {
        throw new ConflictException('Duplicate review');
      });

      await expect(service.create(userId, reviewDataDto)).rejects.toThrow(ConflictException);
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
});
