import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('review')
@ApiTags('review')
export class ReviewController {
  /**
   * @param {ReviewService} reviewService
   */
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * Create Review endpoint from given Body and for current user.
   *
   * @param {CreateReviewDto} createReviewDto - DTO used to create Review from.
   * @returns {Promise<Review>} - Created Review.
   */
  @Post()
  @ApiOperation({ summary: 'Create a review.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created review.',
    type: Review,
  })
  create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    const userId = 1;
    return this.reviewService.create(userId, createReviewDto);
  }

  /**
   * Find all Reviews for current user.
   *
   * @returns {Promise<Review[]>} - List of found Reviews.
   */
  @Get()
  @ApiOperation({ summary: 'Get all reviews items for current user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found reviews.',
    type: Review,
  })
  findAll(): Promise<Review[]> {
    const userId = 1;
    return this.reviewService.findAll(userId);
  }

  /**
   * Find Review by ID for given user.
   *
   * @param {number} id - ID of Review.
   * @returns {Promise<Review>} Found Review.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the a Review.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found Review.',
    type: Review,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Review> {
    const userId = 1;
    return this.reviewService.findOne(userId, id);
  }

  /**
   * Find Review by Episode ID for given user.
   *
   * @param {number} episodeID - ID of Episode to find review for.
   * @returns {Promise<Review>} Found Review.
   */
  @Get('episode/:episodeID')
  @ApiOperation({ summary: 'Get a review by Episode ID.' })
  @ApiParam({ name: 'episodeID', description: 'The ID of Episode to find the Review for for current user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found Review.',
    type: Review,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  findOneByEpisode(@Param('episodeID', ParseIntPipe) episodeID: number): Promise<Review> {
    const userId = 1;
    return this.reviewService.findOneByEpisode(userId, episodeID);
  }

  /**
   * Update Review with given partial for current user.
   *
   * @param {number} id - Review ID.
   * @param {UpdateReviewDto} updateReviewDto - Partial data.
   * @returns {Promise<Review>} Updated Review.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update existing review by ID for current user.' })
  @ApiParam({ name: 'id', description: 'The ID of the a Review.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated Review.',
    type: Review,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
    const userId = 1;
    return this.reviewService.update(userId, id, updateReviewDto);
  }

  /**
   * Delete Review by ID.
   *
   * @param {number} id - Review ID to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the a Review.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Empty response.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const userId = 1;
    return this.reviewService.remove(userId, id);
  }
}
