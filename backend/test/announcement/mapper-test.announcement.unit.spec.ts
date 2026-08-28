import { AnnouncementEntity } from 'src/announcement/entities/announcement.entity';
import { mapAnnouncementEntityToDto } from 'src/announcement/mappers/announcement.mapper';
import { CATEGORY_CODE } from 'src/category/enums/category.enum';
import { CategoryEntity } from 'src/category/entities/category.entity';

const buildCategory = (
  id: number,
  code: CATEGORY_CODE,
  orderingNumber: number,
): CategoryEntity =>
  ({
    id,
    code,
    labels: { en: code, sk: code },
    orderingNumber,
    created: new Date('2026-01-01T00:00:00.000Z'),
    updated: new Date('2026-01-01T00:00:00.000Z'),
  }) as CategoryEntity;

const buildAnnouncement = (): AnnouncementEntity =>
  ({
    id: 7,
    title: 'Water supply interruption',
    body: 'Water will be shut off on Main Street',
    publicationDate: new Date('2026-08-28T08:55:00.000Z'),
    created: new Date('2026-08-27T10:00:00.000Z'),
    updated: new Date('2026-08-28T09:12:00.000Z'),
    categories: [
      buildCategory(1, CATEGORY_CODE.CITY, 1),
      buildCategory(6, CATEGORY_CODE.EMERGENCIES, 6),
    ],
  }) as AnnouncementEntity;

describe('mapAnnouncementEntityToDto', () => {
  it('maps every scalar field onto the dto', () => {
    const announcement = buildAnnouncement();

    const dto = mapAnnouncementEntityToDto(announcement);

    expect(dto.id).toBe(7);
    expect(dto.title).toBe('Water supply interruption');
    expect(dto.body).toBe('Water will be shut off on Main Street');
  });

  it('serialises the publication date in the transport format and the timestamps as ISO 8601', () => {
    const dto = mapAnnouncementEntityToDto(buildAnnouncement());

    expect(dto.publicationDate).toBe('08/28/2026 08:55');
    expect(dto.created).toBe('2026-08-27T10:00:00.000Z');
    expect(dto.updated).toBe('2026-08-28T09:12:00.000Z');
  });

  it('maps the categories preserving their order', () => {
    const dto = mapAnnouncementEntityToDto(buildAnnouncement());

    expect(dto.categories).toHaveLength(2);
    expect(dto.categories.map((category) => category.code)).toEqual([
      CATEGORY_CODE.CITY,
      CATEGORY_CODE.EMERGENCIES,
    ]);
  });

  it('does not leak entity timestamps into the category dtos', () => {
    const dto = mapAnnouncementEntityToDto(buildAnnouncement());

    expect(Object.keys(dto.categories[0]).sort()).toEqual([
      'code',
      'id',
      'labels',
      'orderingNumber',
    ]);
  });
});
