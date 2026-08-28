export type TranslationType = {
  readonly en: string;
  readonly sk: string;
};

export type CategoryType = {
  readonly id: number;
  readonly code: string;
  readonly labels: TranslationType;
  readonly orderingNumber: number;
};

export type CategoryOptionType = {
  readonly id: number;
  readonly label: string;
};
