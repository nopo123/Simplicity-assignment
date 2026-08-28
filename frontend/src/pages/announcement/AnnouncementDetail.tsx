import { useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AnnouncementForm from "src/components/form/announcement/AnnouncementForm";
import ClassicLoader from "src/components/customs/ClassicLoader";
import { useAnnouncementDetail } from "src/hooks/announcements/useAnnouncementDetail";
import { globalStyles } from "src/styles/globalStyles";
import { AnnouncementFormValues } from "src/components/form/announcement/types/announcementForm";
import { mapFormValuesToPayload } from "src/components/form/announcement/utils/announcementFormValues";

const AnnouncementDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const announcementId = id ? Number(id) : undefined;

  const { announcement, isLoading, saveAnnouncement, isSaving } =
    useAnnouncementDetail({ announcementId });

  const handleSubmit = useCallback(
    (values: AnnouncementFormValues) =>
      saveAnnouncement(mapFormValuesToPayload(values)),
    [saveAnnouncement],
  );

  if (announcementId && isLoading) {
    return <ClassicLoader />;
  }

  return (
    <Box sx={globalStyles.pageWrapper}>
      <Typography variant="h4">
        {announcementId
          ? t("announcements.form.editTitle")
          : t("announcements.form.createTitle")}
      </Typography>

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
