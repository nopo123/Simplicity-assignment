import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { categoryApi } from "src/api/category";
import { QUERY_KEYS } from "src/hooks/common/queryKeys";
import { useErrorSnackbar } from "src/hooks/common/useErrorSnackbar";
import { CategoryOptionType, CategoryType } from "src/types/category";
import { resolveCategoryLabel } from "src/utils/category/categoryLabel";

export const useCategories = () => {
  const { i18n } = useTranslation();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<CategoryType[]>({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: categoryApi.getCategories,
    staleTime: Infinity,
  });

  const categoryOptions: CategoryOptionType[] = useMemo(
    () =>
      (categories ?? []).map((category) => ({
        id: category.id,
        label: resolveCategoryLabel(category, i18n.language),
      })),
    [categories, i18n.language],
  );

  useErrorSnackbar(isError);

  return { categoryOptions, isLoading };
};
