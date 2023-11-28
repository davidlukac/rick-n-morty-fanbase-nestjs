import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';

/**
 * Review service.
 */
@Injectable()
export class ReviewService {
  /**
   * @param {Repository<Review>} reviewRepository
   */
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  /**
   * Create Review for given user from given partial.
   *
   * @param {number} userId - User for which we perform and limit the operation to.
   * @param {CreateReviewDto} createReviewDto - Review partial to use for creation.
   * @returns {Promise<Review>} Created Review.
   * @throws {ConflictException} When database constrains are not met.
   */
  async create(userId: number, createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const review = this.reviewRepository.create({
        ...createReviewDto,
        user: { id: userId } as User,
      });

      return await this.reviewRepository.save(review);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Database constrains were not met!');
      }
      throw error;
    }
  }

  /**
   * Find all Reviews for given user.
   *
   * @param {number} userId - User for which we perform and limit the operation to.
   * @returns {Promise<Review[]>} List of found Reviews.
   */
  async findAll(userId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
  }

  /**
   * Find Review by ID.
   *
   * @param {number} userId - User for which we perform and limit the operation to.
   * @param {number} id - ID of Review to find.
   * @returns {Promise<Review>} Found Review.
   * @throws {NotFoundException} If Review with given ID is not found.
   */
  async findOne(userId: number, id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found.`);
    }

    return review;
  }

  /**
   * Find Review by Episode ID.
   *
   * @param {number} userId - User for which we perform and limit the operation to.
   * @param {number} episodeId - ID of Episode to find Review for.
   * @returns {Promise<Review>} Found Review.
   * @throws {NotFoundException} If Review with given ID is not found.
   */
  async findOneByEpisode(userId: number, episodeId: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: {
        episodeId: episodeId,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Review for Episode ID ${episodeId} not found.`);
    }

    return review;
  }

  /**
   * Update Review with given partial.
   *
   * @param {number} userId - User for which we perform and limit the operation to.
   * @param {number} id - ID of Review to remove.
   * @param {UpdateReviewDto} updateReviewDto - Partial with fields to update.
   * @returns {Promise<Review>} - Updated Review.
   * @throws {ConflictException} When database constrains are not met.
   */
  async update(userId: number, id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOne({
        where: { id: Number(id), user: { id: userId } },
      });

      if (!review) {
        throw new Error(`Review #${id} not found`);
      }

      this.reviewRepository.merge(review, updateReviewDto);

      return await this.reviewRepository.save(review);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Database constrains were not met!');
      }
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    const review = await this.findOne(userId, id);
    if (!review) {
      throw new Error(`Review #${id} not found`);
    }
    await this.reviewRepository.remove(review);
  }
}
