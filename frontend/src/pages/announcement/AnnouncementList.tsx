import { useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AnnouncementFilters from "src/components/announcement/AnnouncementFilters";
import AnnouncementTable from "src/components/announcement/AnnouncementTable";
import ClassicLoader from "src/components/customs/ClassicLoader";
import { useAnnouncements } from "src/hooks/announcements/useAnnouncements";
import { PATHS } from "src/routes/paths";
import { PageTitleRowStyled } from "src/styles/customStyledComponent";
import { globalStyles } from "src/styles/globalStyles";

const AnnouncementList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    announcements,
    total,
    isLoading,
    searchInput,
    categoryIds,
    sortBy,
    sortOrder,
    page,
    handleSearch,
    handleCategoryChange,
    handleSort,
    handleChangePage,
  } = useAnnouncements();

  const handleEdit = useCallback(
    (announcementId: number) => navigate(PATHS.announcements.detail(announcementId)),
    [navigate],
  );

  const handleCreate = useCallback(
    () => navigate(PATHS.announcements.new),
    [navigate],
  );

  return (
    <Box sx={globalStyles.pageWrapper}>
      <PageTitleRowStyled>
        <Typography variant="h4">{t("announcements.title")}</Typography>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          {t("announcements.create")}
        </Button>
      </PageTitleRowStyled>

      <AnnouncementFilters
        searchTerm={searchInput}
        categoryIds={categoryIds}
        t={t}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      {isLoading ? (
        <ClassicLoader />
      ) : (
        <AnnouncementTable
          announcements={announcements}
          total={total}
          page={page}
          sortBy={sortBy}
          sortOrder={sortOrder}
          language={i18n.language}
          t={t}
          onSort={handleSort}
          onChangePage={handleChangePage}
          onEdit={handleEdit}
        />
      )}
    </Box>
  );
};

export default AnnouncementList;
