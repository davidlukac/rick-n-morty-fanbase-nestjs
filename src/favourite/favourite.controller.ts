import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { Favourite } from './entities/favourite.entity';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckFavouriteDto } from './dto/check-favourite.dto';

/**
 * FavouriteController.
 */
@Controller('favourite')
@ApiTags('favourite')
export class FavouriteController {
  /**
   * @param {FavouriteService} favouriteService
   */
  constructor(private readonly favouriteService: FavouriteService) {}

  /**
   * Create Favourite endpoint from given Body and for current user.
   *
   * @param {CreateFavouriteDto} createFavouriteDto - DTO used to create Favourite from.
   * @returns {Promise<Favourite>} - Created Favourite.
   */
  @Post()
  @ApiOperation({ summary: 'Create a favourite.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created favourite.',
    type: Favourite,
  })
  create(@Body() createFavouriteDto: CreateFavouriteDto): Promise<Favourite> {
    const userId = 1;
    return this.favouriteService.create(userId, createFavouriteDto);
  }

  /**
   * Find all Favourites for current user.
   *
   * @returns {Promise<Favourite[]>} - List of found Favourites.
   */
  @Get()
  @ApiOperation({ summary: 'Get all favourited items for current user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found favourites.',
    type: Favourite,
  })
  findAll(): Promise<Favourite[]> {
    const userId = 1;
    return this.favouriteService.findAll(userId);
  }

  /**
   * Find Favourite by ID for given user.
   *
   * @param {number} id - ID of Favourite.
   * @returns {Promise<Favourite>} Found Favourite.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a favourite by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the a Favourite.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found favourite.',
    type: Favourite,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Favourite> {
    const userId = 1;
    return this.favouriteService.findOne(userId, id);
  }

  /**
   * Check if entity with given ID and type is favourited for current user.
   *
   * @param {CheckFavouriteDto} checkFavouriteDto - Entity info to check for.
   * @returns {Promise<boolean>} True if entity is favourited.
   */
  @Post('check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check if entity with given ID and type is favourited for current user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Boolean value',
    type: Boolean,
  })
  async isFavourited(@Body() checkFavouriteDto: CheckFavouriteDto): Promise<boolean> {
    const userId = 1;

    return this.favouriteService.isFavourited(userId, checkFavouriteDto.entityId, checkFavouriteDto.entityTypeId);
  }

  /**
   * Delete Favourite by ID.
   *
   * @param {number} id - Favourite ID to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a favourite by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the a Favourite.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Empty response.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const userId = 1;
    return this.favouriteService.remove(userId, id);
  }
}
