import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

const mockReviewService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ReviewController', () => {
  let controller: ReviewController;
  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: mockReviewService,
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service create method with correct parameters', async () => {
      const reviewData = { episodeId: 1, text: 'Amazing!', rating: 5 };
      const reviewDataDto = new CreateReviewDto();
      Object.assign(reviewDataDto, reviewData);

      const mockedReviewData = { ...reviewData, id: 1, user: { id: userId } };
      const mockedReview = new Review();
      Object.assign(mockedReview, mockedReviewData);

      mockReviewService.create.mockResolvedValue(mockedReview);

      const result = await controller.create(reviewDataDto);
      expect(result).toEqual(mockedReview);
      expect(result).toHaveProperty('id');
      expect(mockReviewService.create).toHaveBeenCalledWith(userId, reviewDataDto);
    });
  });

  describe('findAll', () => {
    it('should call the service findAll method', async () => {
      const reviews = [new Review(), new Review()];

      mockReviewService.findAll.mockResolvedValue(reviews);

      expect(await controller.findAll()).toEqual(reviews);
      expect(mockReviewService.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method with correct ID', async () => {
      const review = new Review();
      const reviewId = 1;

      mockReviewService.findOne.mockResolvedValue(review);

      expect(await controller.findOne(reviewId)).toEqual(review);
      expect(mockReviewService.findOne).toHaveBeenCalledWith(userId, reviewId);
    });
  });
});
