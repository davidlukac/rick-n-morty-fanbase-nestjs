import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { Favourite } from './entities/favourite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { EntityType } from './entities/entity-type.entity';

/**
 * Favourite service.
 */
@Injectable()
export class FavouriteService {
  /**
   * @param {Repository<Favourite>} favouriteRepository
   * @param {Repository<EntityType>} entityTypeRepository
   */
  constructor(
    @InjectRepository(Favourite)
    private readonly favouriteRepository: Repository<Favourite>,
    @InjectRepository(EntityType)
    private readonly entityTypeRepository: Repository<EntityType>,
  ) {}

  /**
   * Create Favourite for given user from given partial.
   *
   * @param {number} userId - User for which we perform and limit the operation to.
   * @param {CreateFavouriteDto} createFavouriteDto - Favourite partial to use for creation.
   * @returns {Promise<Favourite>} Created Favourite.
   * @throws {NotFoundException} If given EntityTypeID is not valid.
   * @throws {ConflictException} When database constrains are not met.
   */
  async create(userId: number, createFavouriteDto: CreateFavouriteDto): Promise<Favourite> {
    // Validate entityTypeID.
    const entityType = await this.entityTypeRepository.findOneBy({ id: createFavouriteDto.entityTypeId });

    if (!entityType) {
      throw new NotFoundException(`Invalid EntityType - ID ${createFavouriteDto.entityTypeId} not found.`);
    }

    try {
      const favourite = this.favouriteRepository.create({
        ...createFavouriteDto,
        user: { id: userId } as User,
        entityType: { id: createFavouriteDto.entityTypeId } as EntityType,
      });

      return await this.favouriteRepository.save(favourite);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Database constrains were not met!');
      }
      throw error;
    }
  }

  /**
   * Find all Favourites for given user.
   *
   * @param {number} userId - User for which we perform and limit the operation to.
   * @returns {Promise<Favourite[]>} List of found Favourites.
   */
  async findAll(userId: number): Promise<Favourite[]> {
    return this.favouriteRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user', 'entityType'],
    });
  }

  /**
   * Find Favourite by ID.
   *
   * @param {number} userId - User for which we perform and limit the operation to.
   * @param {number} id - ID of Favourite to remove.
   * @returns {Promise<Favourite>} Found Favourite.
   * @throws {NotFoundException} If Favourite with given ID is not found.
   */
  async findOne(userId: number, id: number): Promise<Favourite> {
    const favourite = await this.favouriteRepository.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
      relations: ['user', 'entityType'],
    });

    if (!favourite) {
      throw new NotFoundException(`Favourite with ID ${id} not found.`);
    }

    return favourite;
  }

  /**
   * Check if entity with given ID and type is favourited by given user.
   *
   * @param {number} userId - ID of user.
   * @param {number} entityId - ID of entity to check.
   * @param {number} entityTypeId - ID of entity type.
   * @returns {boolean}
   */
  async isFavourited(userId: number, entityId: number, entityTypeId: number): Promise<boolean> {
    const favourite = await this.favouriteRepository.findOne({
      where: {
        entityId: entityId,
        entityType: { id: entityTypeId },
        user: { id: userId },
      },
    });

    let isFavourite = false;

    if (favourite) {
      isFavourite = true;
    }

    return isFavourite;
  }

  /**
   * Delete entity with given ID.
   *
   * @param {number} userId - User for which we perform and limit the operation to.
   * @param {number} id - ID of Favourite to remove.
   */
  async remove(userId: number, id: number): Promise<void> {
    const favourite = await this.findOne(userId, id);
    if (!favourite) {
      throw new Error(`Favourite #${id} not found`);
    }
    await this.favouriteRepository.remove(favourite);
  }
}
