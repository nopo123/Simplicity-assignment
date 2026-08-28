import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { categoryApi } from "src/api/category";
import { CategoryOptionType, CategoryType } from "src/types/category";
import { resolveCategoryLabel } from "src/utils/category/categoryLabel";

export const useCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<CategoryType[]>({
    queryKey: ["categories"],
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

  useEffect(() => {
    if (isError) {
      enqueueSnackbar(t("general.errorOccurred"), { variant: "error" });
    }
  }, [isError, enqueueSnackbar, t]);

  return { categories, categoryOptions, isLoading };
};
