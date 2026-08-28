import Box from "@mui/material/Box";
import { TFunction } from "i18next";
import MultiAutocomplete from "src/components/selects/MultiAutocomplete";
import SearchField from "src/components/customs/SearchField";
import { useCategories } from "src/hooks/categories/useCategories";
import { AnnouncementCategoryFilterStyled } from "src/styles/customStyledComponent";
import { globalStyles } from "src/styles/globalStyles";

interface AnnouncementFiltersProps {
  searchTerm: string;
  categoryIds: number[];
  t: TFunction;
  onSearch: (value: string) => void;
  onCategoryChange: (selectedIds: number[]) => void;
}

const AnnouncementFilters = ({
  searchTerm,
  categoryIds,
  t,
  onSearch,
  onCategoryChange,
}: AnnouncementFiltersProps) => {
  const { categoryOptions, isLoading } = useCategories();

  return (
    <Box sx={globalStyles.filtersWrapper}>
      <SearchField
        searchTerm={searchTerm}
        placeholder={t("announcements.filters.searchPlaceholder")}
        onSearch={onSearch}
      />
      <AnnouncementCategoryFilterStyled>
        <MultiAutocomplete
          name="categoryFilter"
          label={t("announcements.filters.category")}
          items={categoryOptions}
          values={categoryIds}
          handleChange={onCategoryChange}
          noOptionsText={t("general.noResults")}
          placeholder={t("announcements.filters.categoryPlaceholder")}
          disabled={isLoading}
        />
      </AnnouncementCategoryFilterStyled>
    </Box>
  );
};

export default AnnouncementFilters;
