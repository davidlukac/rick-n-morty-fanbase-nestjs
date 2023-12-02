import { DataSource } from 'typeorm';
import { EntityType } from './favourite/entities/entity-type.entity';
import { User } from '@user/entities/user.entity';

const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'data/database.db',
  entities: [EntityType, User],
  synchronize: true,
});

/**
 * Seed "constants" into the DB.
 */
async function seed() {
  await appDataSource.initialize().catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

  const entityTypes = [
    { id: 1, type: 'location' },
    { id: 2, type: 'episode' },
    { id: 3, type: 'character' },
  ];

  const entityTypeRepository = appDataSource.getRepository(EntityType);

  for (const entityTypeData of entityTypes) {
    let entityType = await entityTypeRepository.findOneBy({ id: entityTypeData.id });
    console.log('Found %s in DB for ID %d', JSON.stringify(entityType), entityTypeData.id);

    if (!entityType) {
      entityType = entityTypeRepository.create(entityTypeData);
      console.log('Created: %s', JSON.stringify(entityType));
    } else {
      entityType.type = entityTypeData.type;
      console.log('Updating: %s', JSON.stringify(entityType));
    }

    await entityTypeRepository.save(entityType);
  }

  const users = [
    { id: 1, name: 'David' },
    { id: 2, name: 'Rick' },
    { id: 3, name: 'Morty' },
  ];

  const userRepository = appDataSource.getRepository(User);

  for (const userData of users) {
    let user = await userRepository.findOneBy({ id: userData.id });
    console.log('Found %s in DB for ID %d', JSON.stringify(user), userData.id);

    if (!user) {
      user = userRepository.create(userData);
      console.log('Created: %s', JSON.stringify(user));
    } else {
      user.name = userData.name;
      console.log('Updating: %s', JSON.stringify(user));
    }

    await userRepository.save(user);
  }

  console.log('Seeding complete!');
}

seed()
  .then(() => appDataSource.destroy())
  .catch((error) => console.error('Seeding failed:', error));
