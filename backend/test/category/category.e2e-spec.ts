import * as http from 'http';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { SetupHelper } from '../testing/helpers/setup.helper';
import { SetupTestingData } from '../testing/interfaces/setup.interface';
import { SEEDED_CATEGORIES } from 'src/category/config/seeded-categories.config';
import { CATEGORY_CODE } from 'src/category/enums/category.enum';

describe('CategoryController (e2e)', () => {
  let server: http.Server;
  let testHelper: SetupHelper;

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const setupData: SetupTestingData = await testHelper.createSetupApp();

    server = setupData.server;
  }, 60000);

  afterAll(async () => {
    await testHelper.close();
  });

  describe('GET /v1/categories', () => {
    it('returns every seeded category', async () => {
      const response = await request(server)
        .get('/v1/categories')
        .expect(HttpStatus.OK);

      expect(response.body).toHaveLength(SEEDED_CATEGORIES.length);
      expect(response.body.map((category) => category.code).sort()).toEqual(
        Object.values(CATEGORY_CODE).sort(),
      );
    });

    it('returns the categories ordered alphabetically by the english label', async () => {
      const response = await request(server)
        .get('/v1/categories')
        .expect(HttpStatus.OK);

      const englishLabels = response.body.map(
        (category) => category.labels.en,
      );

      expect(englishLabels).toEqual([...englishLabels].sort());
    });

    it('exposes both language labels and no entity timestamps', async () => {
      const response = await request(server)
        .get('/v1/categories')
        .expect(HttpStatus.OK);

      expect(Object.keys(response.body[0]).sort()).toEqual([
        'code',
        'id',
        'labels',
        'orderingNumber',
      ]);
      expect(Object.keys(response.body[0].labels).sort()).toEqual(['en', 'sk']);
    });
  });
});
