import { ValidationError } from '@nestjs/common';

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
