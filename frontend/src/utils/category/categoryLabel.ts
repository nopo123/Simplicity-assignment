import { CategoryType, TranslationType } from "src/types/category";

export const resolveCategoryLabel = (
  category: CategoryType,
  language: string,
): string => {
  const labelKey = language.split("-")[0] as keyof TranslationType;

  return category.labels[labelKey] ?? category.labels.en;
};

export const resolveCategoryLabels = (
  categories: CategoryType[],
  language: string,
): string[] =>
  categories.map((category) => resolveCategoryLabel(category, language));
