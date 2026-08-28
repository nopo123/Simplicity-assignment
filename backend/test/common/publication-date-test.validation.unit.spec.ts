import dayjs from 'dayjs';
import {
  PUBLICATION_DATE_ERROR,
  PUBLICATION_DATE_FORMAT,
  PUBLICATION_DATE_PATTERN,
  validatePublicationDate,
} from 'src/common/utils/publication-date.util';

describe('PUBLICATION_DATE_PATTERN', () => {
  it('accepts a value produced by the format constant, so the two cannot drift apart', () => {
    const formatted = dayjs('2026-08-28T08:55:00.000Z').format(
      PUBLICATION_DATE_FORMAT,
    );

    expect(PUBLICATION_DATE_PATTERN.test(formatted)).toBe(true);
  });
});

describe('validatePublicationDate', () => {
  describe('valid values', () => {
    it.each([
      '01/01/2001 00:00',
      '12/31/2026 23:59',
      '02/29/2024 12:30',
      '08/28/2026 08:55',
    ])('accepts %s', (value) => {
      expect(validatePublicationDate(value)).toBeNull();
    });
  });

  describe('missing value', () => {
    it.each([undefined, null, '', '   ', 42])(
      'reports REQUIRED for %p',
      (value) => {
        expect(validatePublicationDate(value)).toEqual({
          error: PUBLICATION_DATE_ERROR.REQUIRED,
        });
      },
    );
  });

  describe('malformed shape', () => {
    it.each([
      '8/28/2026 08:55',
      '08/8/2026 08:55',
      '08/28/26 08:55',
      '08/28/2026 8:55',
      '08/28/2026 08:5',
      '08-28-2026 08:55',
      '08/28/2026T08:55',
      '08/28/2026',
      '08:55',
      '08/28/2026 08:55:00',
      'aa/bb/cccc dd:ee',
      '08/28/2026  08:55',
    ])('reports FORMAT for %s', (value) => {
      expect(validatePublicationDate(value)).toEqual({
        error: PUBLICATION_DATE_ERROR.FORMAT,
      });
    });
  });

  describe('month out of range', () => {
    it.each(['00/15/2026 10:00', '13/15/2026 10:00', '99/15/2026 10:00'])(
      'reports MONTH for %s',
      (value) => {
        expect(validatePublicationDate(value)).toEqual({
          error: PUBLICATION_DATE_ERROR.MONTH,
        });
      },
    );
  });

  describe('day out of range', () => {
    it.each(['01/00/2026 10:00', '01/32/2026 10:00', '01/99/2026 10:00'])(
      'reports DAY for %s',
      (value) => {
        expect(validatePublicationDate(value)).toEqual({
          error: PUBLICATION_DATE_ERROR.DAY,
        });
      },
    );
  });

  describe('day that does not exist in the given month', () => {
    it('reports DAY_IN_MONTH with 28 for february in a common year', () => {
      expect(validatePublicationDate('02/29/2001 10:00')).toEqual({
        error: PUBLICATION_DATE_ERROR.DAY_IN_MONTH,
        maxDay: 28,
      });
    });

    it('reports DAY_IN_MONTH with 29 for february in a leap year', () => {
      expect(validatePublicationDate('02/30/2024 10:00')).toEqual({
        error: PUBLICATION_DATE_ERROR.DAY_IN_MONTH,
        maxDay: 29,
      });
    });

    it('reports DAY_IN_MONTH with 30 for a thirty day month', () => {
      expect(validatePublicationDate('04/31/2026 10:00')).toEqual({
        error: PUBLICATION_DATE_ERROR.DAY_IN_MONTH,
        maxDay: 30,
      });
    });

    it('accepts the last day of a thirty one day month', () => {
      expect(validatePublicationDate('01/31/2026 10:00')).toBeNull();
    });
  });

  describe('hours out of range', () => {
    it.each(['01/15/2026 24:00', '01/15/2026 99:00'])(
      'reports HOUR for %s',
      (value) => {
        expect(validatePublicationDate(value)).toEqual({
          error: PUBLICATION_DATE_ERROR.HOUR,
        });
      },
    );
  });

  describe('minutes out of range', () => {
    it.each(['01/15/2026 10:60', '01/15/2026 10:99'])(
      'reports MINUTE for %s',
      (value) => {
        expect(validatePublicationDate(value)).toEqual({
          error: PUBLICATION_DATE_ERROR.MINUTE,
        });
      },
    );
  });

  describe('reporting order when several parts are wrong', () => {
    it('reports the month before the day', () => {
      expect(validatePublicationDate('13/32/2026 10:00')).toEqual({
        error: PUBLICATION_DATE_ERROR.MONTH,
      });
    });

    it('reports the day before the hours', () => {
      expect(validatePublicationDate('01/32/2026 24:00')).toEqual({
        error: PUBLICATION_DATE_ERROR.DAY,
      });
    });

    it('reports the day in month before the hours', () => {
      expect(validatePublicationDate('02/30/2001 24:00')).toEqual({
        error: PUBLICATION_DATE_ERROR.DAY_IN_MONTH,
        maxDay: 28,
      });
    });

    it('reports the hours before the minutes', () => {
      expect(validatePublicationDate('01/15/2026 24:60')).toEqual({
        error: PUBLICATION_DATE_ERROR.HOUR,
      });
    });
  });
});
