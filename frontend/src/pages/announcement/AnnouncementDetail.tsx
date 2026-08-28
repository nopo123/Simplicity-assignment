import { useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AnnouncementForm from "src/components/form/announcement/AnnouncementForm";
import { AnnouncementFormValues } from "src/components/form/announcement/types/announcementForm";
import { mapFormValuesToPayload } from "src/components/form/announcement/utils/announcementFormValues";
import ClassicLoader from "src/components/customs/ClassicLoader";
import { useAnnouncementDetail } from "src/hooks/announcements/useAnnouncementDetail";
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

  const announcementId = id ? Number(id) : undefined;

  const { announcement, isLoading, saveAnnouncement, isSaving } =
    useAnnouncementDetail({ announcementId });

  const handleSubmit = useCallback(
    (values: AnnouncementFormValues) =>
      saveAnnouncement(mapFormValuesToPayload(values)),
    [saveAnnouncement],
  );

  const handleBack = useCallback(
    () => navigate("/announcements"),
    [navigate],
  );

  if (announcementId && isLoading) {
    return <ClassicLoader />;
  }

  return (
    <Box sx={globalStyles.formPageWrapper}>
      <FormTitleRowStyled>
        <FormBackButtonStyled
          variant="text"
          color="secondary"
          startIcon={icon("arrow-left", 18, 18)}
          onClick={handleBack}
        >
          {t("general.back")}
        </FormBackButtonStyled>
        <Typography variant="h4">
          {announcementId
            ? t("announcements.form.editTitle")
            : t("announcements.form.createTitle")}
        </Typography>
      </FormTitleRowStyled>

      <AnnouncementForm
        announcement={announcement}
        isSaving={isSaving}
        t={t}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default AnnouncementDetail;
