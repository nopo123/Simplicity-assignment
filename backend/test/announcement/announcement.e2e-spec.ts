import * as http from 'http';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { SetupHelper } from '../testing/helpers/setup.helper';
import { SetupTestingData } from '../testing/interfaces/setup.interface';
import { ANNOUNCEMENT_TITLE_MAX_LENGTH } from 'src/announcement/config/announcement-validation.config';
import { CreateAnnouncementDto } from 'src/announcement/dto/create-announcement.dto';
import { UpdateAnnouncementDto } from 'src/announcement/dto/update-announcement.dto';
import { ANNOUNCEMENT_SORT_BY } from 'src/announcement/enums/announcement.enum';
import { CATEGORY_CODE } from 'src/category/enums/category.enum';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { SORT_ORDER } from 'src/common/enums/sort-order.enum';

describe('AnnouncementController (e2e)', () => {
  let server: http.Server;
  let testHelper: SetupHelper;
  let categories: CategoryEntity[];

  const categoryIdByCode = (code: CATEGORY_CODE): number =>
    categories.find((category) => category.code === code).id;

  const buildCreateDto = (
    overrides: Partial<CreateAnnouncementDto> = {},
  ): CreateAnnouncementDto =>
    ({
      title: 'Water supply interruption in the city centre',
      body: 'Water will be shut off on Main Street between 8:00 and 14:00',
      publicationDate: '08/28/2026 08:55',
      categoryIds: [categoryIdByCode(CATEGORY_CODE.CITY)],
      ...overrides,
    }) as CreateAnnouncementDto;

  const createAnnouncement = (dto: CreateAnnouncementDto): request.Test =>
    request(server).post('/v1/announcements').send(dto);

  const createAnnouncementWithout = (
    field: keyof CreateAnnouncementDto,
  ): request.Test => {
    const payload: Record<string, unknown> = { ...buildCreateDto() };
    delete payload[field];

    return request(server).post('/v1/announcements').send(payload);
  };

  const patchAnnouncement = (
    announcementId: number,
    dto: UpdateAnnouncementDto,
  ): request.Test =>
    request(server).patch(`/v1/announcements/${announcementId}`).send(dto);

  const listAnnouncements = (query = ''): request.Test =>
    request(server).get(`/v1/announcements${query}`);

  const createAndExpectId = async (
    dto: CreateAnnouncementDto,
  ): Promise<number> => {
    const response = await createAnnouncement(dto).expect(HttpStatus.CREATED);

    return response.body.id;
  };

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const setupData: SetupTestingData = await testHelper.createSetupApp();

    server = setupData.server;
    categories = setupData.categories;
  }, 60000);

  afterAll(async () => {
    await testHelper.close();
  });

  beforeEach(async () => {
    await testHelper.truncateAnnouncements();
  });

  describe('POST /v1/announcements', () => {
    it('creates an announcement and returns it with its categories', async () => {
      const cityId = categoryIdByCode(CATEGORY_CODE.CITY);
      const healthId = categoryIdByCode(CATEGORY_CODE.HEALTH);

      const response = await createAnnouncement(
        buildCreateDto({ categoryIds: [cityId, healthId] }),
      ).expect(HttpStatus.CREATED);

      expect(response.body.id).toBeGreaterThan(0);
      expect(response.body.title).toBe(
        'Water supply interruption in the city centre',
      );
      expect(response.body.publicationDate).toBe('08/28/2026 08:55');
      expect(
        response.body.categories.map((category) => category.id).sort(),
      ).toEqual([cityId, healthId].sort());
      expect(response.body.created).toBeDefined();
      expect(response.body.updated).toBeDefined();
    });

    it('rejects a missing title', async () => {
      await createAnnouncementWithout('title').expect(HttpStatus.BAD_REQUEST);
    });

    it('rejects a missing body', async () => {
      await createAnnouncementWithout('body').expect(HttpStatus.BAD_REQUEST);
    });

    it('rejects a missing publication date', async () => {
      await createAnnouncementWithout('publicationDate').expect(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('rejects missing categories', async () => {
      await createAnnouncementWithout('categoryIds').expect(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('rejects an empty category list', async () => {
      await createAnnouncement(buildCreateDto({ categoryIds: [] })).expect(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('rejects an unknown category id', async () => {
      const response = await createAnnouncement(
        buildCreateDto({ categoryIds: [999999] }),
      ).expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContain('999999');
    });

    it('rejects an iso publication date, the wire format is the display format', async () => {
      await createAnnouncement(
        buildCreateDto({ publicationDate: '2026-08-28T08:55:00.000Z' }),
      ).expect(HttpStatus.BAD_REQUEST);
    });

    it.each([
      ['a malformed value', '8/28/2026 08:55', 'format'],
      ['a month out of range', '13/28/2026 08:55', 'month'],
      ['a day out of range', '01/32/2026 08:55', 'day'],
      ['a day missing from that month', '02/29/2001 08:55', 'does not exist'],
      ['hours out of range', '01/15/2026 24:00', 'hours'],
      ['minutes out of range', '01/15/2026 10:60', 'minutes'],
    ])(
      'rejects %s and says which part is wrong',
      async (_scenario, publicationDate, expectedMessagePart) => {
        const response = await createAnnouncement(
          buildCreateDto({ publicationDate }),
        ).expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message.toLowerCase()).toContain(
          expectedMessagePart,
        );
      },
    );

    it('rejects a title over the maximum length', async () => {
      await createAnnouncement(
        buildCreateDto({
          title: 'x'.repeat(ANNOUNCEMENT_TITLE_MAX_LENGTH + 1),
        }),
      ).expect(HttpStatus.BAD_REQUEST);
    });

    it('rejects a title made only of whitespace', async () => {
      await createAnnouncement(buildCreateDto({ title: '   ' })).expect(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('rejects a body made only of whitespace', async () => {
      await createAnnouncement(buildCreateDto({ body: '     ' })).expect(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('stores the title and the body without their surrounding whitespace', async () => {
      const response = await createAnnouncement(
        buildCreateDto({ title: '  Park closed  ', body: '  For repairs  ' }),
      ).expect(HttpStatus.CREATED);

      expect(response.body.title).toBe('Park closed');
      expect(response.body.body).toBe('For repairs');
    });

    it('rejects an unknown property', async () => {
      await createAnnouncement({
        ...buildCreateDto(),
        unexpectedField: true,
      } as unknown as CreateAnnouncementDto).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/announcements', () => {
    it('sorts by last update descending by default', async () => {
      const firstId = await createAndExpectId(
        buildCreateDto({ title: 'First created' }),
      );
      const secondId = await createAndExpectId(
        buildCreateDto({ title: 'Second created' }),
      );

      const response = await listAnnouncements().expect(HttpStatus.OK);

      expect(response.body.items.map((item) => item.id)).toEqual([
        secondId,
        firstId,
      ]);
      expect(response.body.total).toBe(2);
      expect(response.body.page).toBe(1);
    });

    it('sorts by publication date when asked', async () => {
      const olderId = await createAndExpectId(
        buildCreateDto({ publicationDate: '01/01/2026 00:00' }),
      );
      const newerId = await createAndExpectId(
        buildCreateDto({ publicationDate: '12/31/2026 00:00' }),
      );

      const response = await listAnnouncements(
        `?sortBy=${ANNOUNCEMENT_SORT_BY.PUBLICATION_DATE}&sortOrder=${SORT_ORDER.ASC}`,
      ).expect(HttpStatus.OK);

      expect(response.body.items.map((item) => item.id)).toEqual([
        olderId,
        newerId,
      ]);
    });

    it('sorts by title ascending when asked', async () => {
      await createAndExpectId(buildCreateDto({ title: 'Zebra crossing' }));
      await createAndExpectId(buildCreateDto({ title: 'Apple festival' }));

      const response = await listAnnouncements(
        `?sortBy=${ANNOUNCEMENT_SORT_BY.TITLE}&sortOrder=${SORT_ORDER.ASC}`,
      ).expect(HttpStatus.OK);

      expect(response.body.items.map((item) => item.title)).toEqual([
        'Apple festival',
        'Zebra crossing',
      ]);
    });

    it('finds a match in the title', async () => {
      await createAndExpectId(buildCreateDto({ title: 'Playground opening' }));
      await createAndExpectId(buildCreateDto({ title: 'Storm warning' }));

      const response = await listAnnouncements('?search=playground').expect(
        HttpStatus.OK,
      );

      expect(response.body.total).toBe(1);
      expect(response.body.items[0].title).toBe('Playground opening');
    });

    it('finds a match in the body', async () => {
      await createAndExpectId(
        buildCreateDto({
          title: 'Neutral title',
          body: 'A rare kangaroo sighting',
        }),
      );
      await createAndExpectId(
        buildCreateDto({
          title: 'Another title',
          body: 'Nothing unusual here',
        }),
      );

      const response = await listAnnouncements('?search=kangaroo').expect(
        HttpStatus.OK,
      );

      expect(response.body.total).toBe(1);
      expect(response.body.items[0].body).toBe('A rare kangaroo sighting');
    });

    it('matches case insensitively', async () => {
      await createAndExpectId(
        buildCreateDto({ title: 'Storm WARNING issued' }),
      );

      const response = await listAnnouncements('?search=warning').expect(
        HttpStatus.OK,
      );

      expect(response.body.total).toBe(1);
    });

    it('treats a percent sign in the term literally', async () => {
      await createAndExpectId(
        buildCreateDto({ title: 'Passes are 30% cheaper' }),
      );
      await createAndExpectId(buildCreateDto({ title: 'No discount at all' }));

      const response = await listAnnouncements('?search=30%25').expect(
        HttpStatus.OK,
      );

      expect(response.body.total).toBe(1);
      expect(response.body.items[0].title).toBe('Passes are 30% cheaper');
    });

    it('filters by a single category', async () => {
      const cityId = categoryIdByCode(CATEGORY_CODE.CITY);
      const healthId = categoryIdByCode(CATEGORY_CODE.HEALTH);
      const cityAnnouncementId = await createAndExpectId(
        buildCreateDto({ categoryIds: [cityId] }),
      );
      await createAndExpectId(buildCreateDto({ categoryIds: [healthId] }));

      const response = await listAnnouncements(`?categoryIds=${cityId}`).expect(
        HttpStatus.OK,
      );

      expect(response.body.total).toBe(1);
      expect(response.body.items[0].id).toBe(cityAnnouncementId);
    });

    it('filters by several categories as a union', async () => {
      const cityId = categoryIdByCode(CATEGORY_CODE.CITY);
      const healthId = categoryIdByCode(CATEGORY_CODE.HEALTH);
      const cultureId = categoryIdByCode(CATEGORY_CODE.CULTURE);
      await createAndExpectId(buildCreateDto({ categoryIds: [cityId] }));
      await createAndExpectId(buildCreateDto({ categoryIds: [healthId] }));
      await createAndExpectId(buildCreateDto({ categoryIds: [cultureId] }));

      const response = await listAnnouncements(
        `?categoryIds=${cityId},${healthId}`,
      ).expect(HttpStatus.OK);

      expect(response.body.total).toBe(2);
    });

    it('returns every category of a filtered announcement, not only the matched one', async () => {
      const cityId = categoryIdByCode(CATEGORY_CODE.CITY);
      const healthId = categoryIdByCode(CATEGORY_CODE.HEALTH);
      await createAndExpectId(
        buildCreateDto({ categoryIds: [cityId, healthId] }),
      );

      const response = await listAnnouncements(`?categoryIds=${cityId}`).expect(
        HttpStatus.OK,
      );

      expect(
        response.body.items[0].categories.map((category) => category.id).sort(),
      ).toEqual([cityId, healthId].sort());
    });

    it('combines the search and the category filter', async () => {
      const cityId = categoryIdByCode(CATEGORY_CODE.CITY);
      const healthId = categoryIdByCode(CATEGORY_CODE.HEALTH);
      await createAndExpectId(
        buildCreateDto({ title: 'Storm warning', categoryIds: [cityId] }),
      );
      await createAndExpectId(
        buildCreateDto({ title: 'Storm warning', categoryIds: [healthId] }),
      );
      await createAndExpectId(
        buildCreateDto({ title: 'Film nights', categoryIds: [cityId] }),
      );

      const response = await listAnnouncements(
        `?search=storm&categoryIds=${cityId}`,
      ).expect(HttpStatus.OK);

      expect(response.body.total).toBe(1);
      expect(response.body.items[0].title).toBe('Storm warning');
    });

    it('paginates and reports the total across all pages', async () => {
      await createAndExpectId(buildCreateDto({ title: 'One' }));
      await createAndExpectId(buildCreateDto({ title: 'Two' }));
      await createAndExpectId(buildCreateDto({ title: 'Three' }));

      const response = await listAnnouncements('?page=2&limit=2').expect(
        HttpStatus.OK,
      );

      expect(response.body.items).toHaveLength(1);
      expect(response.body.total).toBe(3);
      expect(response.body.page).toBe(2);
      expect(response.body.limit).toBe(2);
    });

    it('rejects a page size over the maximum', async () => {
      await listAnnouncements('?limit=1000').expect(HttpStatus.BAD_REQUEST);
    });

    it('rejects an unknown sort column', async () => {
      await listAnnouncements('?sortBy=BODY').expect(HttpStatus.BAD_REQUEST);
    });

    it('returns an empty page when nothing matches', async () => {
      await createAndExpectId(buildCreateDto({ title: 'Storm warning' }));

      const response = await listAnnouncements(
        '?search=nothingmatchesthis',
      ).expect(HttpStatus.OK);

      expect(response.body.items).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });
  });

  describe('GET /v1/announcements/:id', () => {
    it('returns the announcement with its categories', async () => {
      const announcementId = await createAndExpectId(buildCreateDto());

      const response = await request(server)
        .get(`/v1/announcements/${announcementId}`)
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(announcementId);
      expect(response.body.categories).toHaveLength(1);
    });

    it('returns 404 for an unknown id', async () => {
      await request(server)
        .get('/v1/announcements/999999')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('rejects a non numeric id', async () => {
      await request(server)
        .get('/v1/announcements/abc')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/announcements/:id', () => {
    it('updates the supplied fields and leaves the others alone', async () => {
      const announcementId = await createAndExpectId(buildCreateDto());

      const response = await patchAnnouncement(announcementId, {
        title: 'Updated title',
      } as UpdateAnnouncementDto).expect(HttpStatus.OK);

      expect(response.body.title).toBe('Updated title');
      expect(response.body.body).toBe(
        'Water will be shut off on Main Street between 8:00 and 14:00',
      );
    });

    it('replaces the whole category set rather than merging it', async () => {
      const cityId = categoryIdByCode(CATEGORY_CODE.CITY);
      const healthId = categoryIdByCode(CATEGORY_CODE.HEALTH);
      const cultureId = categoryIdByCode(CATEGORY_CODE.CULTURE);
      const announcementId = await createAndExpectId(
        buildCreateDto({ categoryIds: [cityId, healthId] }),
      );

      const response = await patchAnnouncement(announcementId, {
        categoryIds: [cultureId],
      } as UpdateAnnouncementDto).expect(HttpStatus.OK);

      expect(response.body.categories.map((category) => category.id)).toEqual([
        cultureId,
      ]);
    });

    it('moves the last update forward when only the categories change', async () => {
      const cityId = categoryIdByCode(CATEGORY_CODE.CITY);
      const cultureId = categoryIdByCode(CATEGORY_CODE.CULTURE);
      const olderId = await createAndExpectId(
        buildCreateDto({ title: 'Older', categoryIds: [cityId] }),
      );
      const newerId = await createAndExpectId(
        buildCreateDto({ title: 'Newer', categoryIds: [cityId] }),
      );

      const patchResponse = await patchAnnouncement(olderId, {
        categoryIds: [cultureId],
      } as UpdateAnnouncementDto).expect(HttpStatus.OK);

      const listResponse = await listAnnouncements().expect(HttpStatus.OK);

      expect(listResponse.body.items.map((item) => item.id)).toEqual([
        olderId,
        newerId,
      ]);
      expect(
        new Date(patchResponse.body.updated).getTime(),
      ).toBeGreaterThanOrEqual(new Date(patchResponse.body.created).getTime());
    });

    it('persists the update so a later read returns it', async () => {
      const announcementId = await createAndExpectId(buildCreateDto());

      await patchAnnouncement(announcementId, {
        body: 'Rewritten body',
        publicationDate: '01/15/2027 10:30',
      } as UpdateAnnouncementDto).expect(HttpStatus.OK);

      const response = await request(server)
        .get(`/v1/announcements/${announcementId}`)
        .expect(HttpStatus.OK);

      expect(response.body.body).toBe('Rewritten body');
      expect(response.body.publicationDate).toBe('01/15/2027 10:30');
    });

    it('rejects an empty category list', async () => {
      const announcementId = await createAndExpectId(buildCreateDto());

      await patchAnnouncement(announcementId, {
        categoryIds: [],
      } as UpdateAnnouncementDto).expect(HttpStatus.BAD_REQUEST);
    });

    it('returns 404 for an unknown id', async () => {
      await patchAnnouncement(999999, {
        title: 'Nope',
      } as UpdateAnnouncementDto).expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/announcements/:id', () => {
    it('deletes the announcement', async () => {
      const announcementId = await createAndExpectId(buildCreateDto());

      await request(server)
        .delete(`/v1/announcements/${announcementId}`)
        .expect(HttpStatus.NO_CONTENT);

      await request(server)
        .get(`/v1/announcements/${announcementId}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('returns 404 when deleting twice', async () => {
      const announcementId = await createAndExpectId(buildCreateDto());

      await request(server)
        .delete(`/v1/announcements/${announcementId}`)
        .expect(HttpStatus.NO_CONTENT);

      await request(server)
        .delete(`/v1/announcements/${announcementId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
