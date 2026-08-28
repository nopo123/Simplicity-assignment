import { ValidationError } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import {
  PUBLICATION_DATE_DAY_MAX,
  PUBLICATION_DATE_DAY_MIN,
  PUBLICATION_DATE_ERROR,
  PUBLICATION_DATE_FORMAT,
  PUBLICATION_DATE_HOUR_MAX,
  PUBLICATION_DATE_MINUTE_MAX,
  PUBLICATION_DATE_MONTH_MAX,
  PUBLICATION_DATE_MONTH_MIN,
  validatePublicationDate,
} from '../utils/publication-date.util';

const PUBLICATION_DATE_ERROR_MESSAGES: Record<PUBLICATION_DATE_ERROR, string> = {
  [PUBLICATION_DATE_ERROR.REQUIRED]: 'publicationDate should not be empty',
  [PUBLICATION_DATE_ERROR.FORMAT]: `publicationDate must use the format ${PUBLICATION_DATE_FORMAT}`,
  [PUBLICATION_DATE_ERROR.MONTH]: `publicationDate month must be between ${String(PUBLICATION_DATE_MONTH_MIN).padStart(2, '0')} and ${PUBLICATION_DATE_MONTH_MAX}`,
  [PUBLICATION_DATE_ERROR.DAY]: `publicationDate day must be between ${String(PUBLICATION_DATE_DAY_MIN).padStart(2, '0')} and ${PUBLICATION_DATE_DAY_MAX}`,
  [PUBLICATION_DATE_ERROR.DAY_IN_MONTH]:
    'publicationDate day does not exist in that month',
  [PUBLICATION_DATE_ERROR.HOUR]: `publicationDate hours must be between 00 and ${PUBLICATION_DATE_HOUR_MAX}`,
  [PUBLICATION_DATE_ERROR.MINUTE]: `publicationDate minutes must be between 00 and ${PUBLICATION_DATE_MINUTE_MAX}`,
};

export const flattenValidationErrors = (
  validationErrors: ValidationError[],
): string => {
  const messages = validationErrors.flatMap((validationError) =>
    collectConstraintMessages(validationError),
  );

  return messages.join(', ');
};

const collectConstraintMessages = (
  validationError: ValidationError,
): string[] => {
  const ownMessages = Object.values(validationError.constraints ?? {});
  const childMessages = (validationError.children ?? []).flatMap((child) =>
    collectConstraintMessages(child),
  );

  return [...ownMessages, ...childMessages];
};

export const toNumberArray = ({ value }: { value: unknown }): unknown => {
  if (value === undefined || value === null) return value;

  const rawValues = Array.isArray(value) ? value : String(value).split(',');

  return rawValues
    .map((rawValue) => String(rawValue).trim())
    .filter((rawValue) => rawValue.length > 0)
    .map(Number);
};

export const IsPublicationDate = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isPublicationDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          const violation = validatePublicationDate(value);
          (this as any).violation = violation;

          return violation === null;
        },
        defaultMessage(_validationArguments?: ValidationArguments) {
          const violation = (this as any).violation as
            | { error: PUBLICATION_DATE_ERROR; maxDay?: number }
            | null;

          if (!violation) return PUBLICATION_DATE_ERROR_MESSAGES.FORMAT;

          if (violation.error === PUBLICATION_DATE_ERROR.DAY_IN_MONTH) {
            return `${PUBLICATION_DATE_ERROR_MESSAGES.DAY_IN_MONTH}, it has ${violation.maxDay} days`;
          }

          return PUBLICATION_DATE_ERROR_MESSAGES[violation.error];
        },
      },
    });
  };
};
