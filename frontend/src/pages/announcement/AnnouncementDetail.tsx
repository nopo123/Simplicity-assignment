import { useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AnnouncementForm from "src/components/form/announcement/AnnouncementForm";
import { AnnouncementFormValues } from "src/components/form/announcement/types/announcementForm";
import { mapFormValuesToPayload } from "src/components/form/announcement/utils/announcementFormValues";
import ClassicLoader from "src/components/customs/ClassicLoader";
import NotFoundPage from "src/pages/NotFoundPage";
import PageTitle from "src/components/customs/PageTitle";
import { DIMENSIONS } from "src/config/config";
import { useAnnouncementDetail } from "src/hooks/announcements/useAnnouncementDetail";
import { PATHS } from "src/routes/paths";
import {
  FormBackButtonStyled,
  FormTitleRowStyled,
} from "src/styles/customStyledComponent";
import { globalStyles } from "src/styles/globalStyles";
import { icon } from "src/utils/style/svgIcon";

const AnnouncementDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const parsedId = Number(id);
  const announcementId =
    Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
  const isUnknownRoute = id !== undefined && announcementId === null;

  const pageTitle = announcementId
    ? t("announcements.form.editTitle")
    : t("announcements.form.createTitle");

  const handleBack = useCallback(
    () => navigate(PATHS.announcements.list),
    [navigate],
  );

  const { announcement, isLoading, isNotFound, saveAnnouncement } =
    useAnnouncementDetail({ announcementId, onLeave: handleBack });

  const handleSubmit = useCallback(
    async (values: AnnouncementFormValues) => {
      await saveAnnouncement(mapFormValuesToPayload(values)).catch(
        () => undefined,
      );
    },
    [saveAnnouncement],
  );

  if (isUnknownRoute || isNotFound) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <ClassicLoader />;
  }

  return (
    <Box sx={globalStyles.formPageWrapper}>
      <PageTitle title={pageTitle} />

      <FormTitleRowStyled>
        <FormBackButtonStyled
          variant="text"
          color="secondary"
          startIcon={icon(
            "arrow-left",
            DIMENSIONS.ICON_SIZE_SMALL,
            DIMENSIONS.ICON_SIZE_SMALL,
          )}
          onClick={handleBack}
        >
          {t("general.back")}
        </FormBackButtonStyled>
        <Typography variant="h4">{pageTitle}</Typography>
      </FormTitleRowStyled>

      <AnnouncementForm announcement={announcement} t={t} onSubmit={handleSubmit} />
    </Box>
  );
};

export default AnnouncementDetail;
