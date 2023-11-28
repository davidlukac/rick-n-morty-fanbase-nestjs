import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let reviewId: number;
  const episodeId = 1000;
  const reviewEndpoint = 'review';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Delete the review if it exists.
    const review = await request(app.getHttpServer()).get(`/${reviewEndpoint}/episode/${episodeId}`);
    if (review.statusCode == HttpStatus.OK) {
      console.debug('Deleting existing review!');
      await request(app.getHttpServer()).delete(`/${reviewEndpoint}/${review.body.id}`).expect(HttpStatus.OK);
    }
  });

  afterEach(async () => {
    // Cleanup after test.
    if (reviewId) {
      await request(app.getHttpServer()).delete(`/${reviewEndpoint}/${reviewId}`).expect(HttpStatus.OK);
    }
  });

  it(`/${reviewEndpoint} (POST)`, async () => {
    const response = await request(app.getHttpServer())
      .post(`/${reviewEndpoint}`)
      .send({ episodeId: episodeId, text: 'Great episode', rating: 5 })
      .expect(HttpStatus.CREATED);

    const body = response.body;
    expect(body).toHaveProperty('id');
    expect(body.episodeId).toEqual(episodeId);
    expect(body.text).toEqual('Great episode');
    expect(body.rating).toEqual(5);

    // Store the reviewId for cleanup use
    reviewId = body.id;
  });
});
