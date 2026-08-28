import { CATEGORY_CODE } from 'src/category/enums/category.enum';

export type SeededAnnouncement = {
  readonly title: string;
  readonly body: string;
  readonly publicationDate: string;
  readonly categoryCodes: readonly CATEGORY_CODE[];
};

export const SEEDED_ANNOUNCEMENTS: readonly SeededAnnouncement[] = [
  {
    title: 'Water supply interruption in the city centre',
    body: 'Water will be shut off on Main Street between 8:00 and 14:00 while the main pipe is replaced. Tank trucks will be parked at both ends of the street.',
    publicationDate: '08/11/2026 04:38',
    categoryCodes: [CATEGORY_CODE.CITY, CATEGORY_CODE.EMERGENCIES],
  },
  {
    title: 'Summer film nights return to the riverside park',
    body: 'Every Friday in August the riverside park turns into an open air cinema. Entry is free, blankets are provided, and the programme is posted at the main gate.',
    publicationDate: '08/11/2026 04:36',
    categoryCodes: [CATEGORY_CODE.CULTURE, CATEGORY_CODE.COMMUNITY_EVENTS],
  },
  {
    title: 'Free flu vaccination for residents over 65',
    body: 'The city health centre offers free flu shots to residents over 65 from September onwards. No appointment is needed, just bring your insurance card.',
    publicationDate: '08/11/2026 04:35',
    categoryCodes: [CATEGORY_CODE.HEALTH, CATEGORY_CODE.FOR_SENIORS],
  },
  {
    title: 'New playground opens in the northern district',
    body: 'The playground behind the community centre is finished and open to the public. It has a toddler area, a climbing frame and shaded benches for parents.',
    publicationDate: '07/19/2026 05:14',
    categoryCodes: [CATEGORY_CODE.KIDS_AND_FAMILY, CATEGORY_CODE.CITY],
  },
  {
    title: 'Reported bicycle thefts near the train station',
    body: 'Several bicycle thefts were reported near the train station over the last two weeks. Please use the guarded bicycle parking on the eastern side of the building.',
    publicationDate: '07/19/2026 05:11',
    categoryCodes: [CATEGORY_CODE.CRIME_AND_SAFETY],
  },
  {
    title: 'Discounted public transport passes for students',
    body: 'Student passes for the next school year are available at a thirty percent discount until the end of September. Apply online or at any ticket office.',
    publicationDate: '07/19/2026 05:09',
    categoryCodes: [
      CATEGORY_CODE.DISCOUNTS_AND_BENEFITS,
      CATEGORY_CODE.KIDS_AND_FAMILY,
    ],
  },
  {
    title: 'Storm warning for the weekend',
    body: 'A strong storm front is expected on Saturday evening. Secure loose objects on balconies and avoid the forest park until the warning is lifted.',
    publicationDate: '06/24/2026 07:27',
    categoryCodes: [CATEGORY_CODE.EMERGENCIES, CATEGORY_CODE.CITY],
  },
  {
    title: 'Senior club opens a new reading room',
    body: 'The senior club on Park Avenue opened a reading room with large print books and a weekly discussion group. Open every weekday from 9:00 to 16:00.',
    publicationDate: '06/24/2026 07:26',
    categoryCodes: [CATEGORY_CODE.FOR_SENIORS, CATEGORY_CODE.CULTURE],
  },
  {
    title: 'Neighbourhood clean up day',
    body: 'Join your neighbours for the spring clean up on the first Saturday of the month. Gloves and bags are handed out at the square from 9:00.',
    publicationDate: '06/24/2026 07:25',
    categoryCodes: [CATEGORY_CODE.COMMUNITY_EVENTS, CATEGORY_CODE.CITY],
  },
  {
    title: 'Vaccination centre moves to the old post office',
    body: 'From next month the vaccination centre operates from the renovated old post office building. The entrance is barrier free and closer to the tram stop.',
    publicationDate: '06/24/2026 07:24',
    categoryCodes: [CATEGORY_CODE.HEALTH, CATEGORY_CODE.CITY],
  },
] as const;
