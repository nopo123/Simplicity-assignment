import { CATEGORY_CODE } from '../enums/category.enum';
import { TranslationDto } from 'src/common/dto/translation.dto';

export type SeededCategory = {
  readonly code: CATEGORY_CODE;
  readonly labels: TranslationDto;
  readonly orderingNumber: number;
};

export const SEEDED_CATEGORIES: readonly SeededCategory[] = [
  {
    code: CATEGORY_CODE.CITY,
    labels: { en: 'City', sk: 'Mesto' },
    orderingNumber: 1,
  },
  {
    code: CATEGORY_CODE.COMMUNITY_EVENTS,
    labels: { en: 'Community events', sk: 'Komunitné akcie' },
    orderingNumber: 2,
  },
  {
    code: CATEGORY_CODE.CRIME_AND_SAFETY,
    labels: { en: 'Crime & Safety', sk: 'Kriminalita a bezpečnosť' },
    orderingNumber: 3,
  },
  {
    code: CATEGORY_CODE.CULTURE,
    labels: { en: 'Culture', sk: 'Kultúra' },
    orderingNumber: 4,
  },
  {
    code: CATEGORY_CODE.DISCOUNTS_AND_BENEFITS,
    labels: { en: 'Discounts & Benefits', sk: 'Zľavy a výhody' },
    orderingNumber: 5,
  },
  {
    code: CATEGORY_CODE.EMERGENCIES,
    labels: { en: 'Emergencies', sk: 'Mimoriadne situácie' },
    orderingNumber: 6,
  },
  {
    code: CATEGORY_CODE.FOR_SENIORS,
    labels: { en: 'For Seniors', sk: 'Pre seniorov' },
    orderingNumber: 7,
  },
  {
    code: CATEGORY_CODE.HEALTH,
    labels: { en: 'Health', sk: 'Zdravie' },
    orderingNumber: 8,
  },
  {
    code: CATEGORY_CODE.KIDS_AND_FAMILY,
    labels: { en: 'Kids & Family', sk: 'Deti a rodina' },
    orderingNumber: 9,
  },
] as const;

export const CATEGORY_CODE_MAX_LENGTH = 64;
