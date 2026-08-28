import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PATHS } from "src/routes/paths";
import { globalStyles } from "src/styles/globalStyles";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Box sx={globalStyles.emptyState}>
      <Typography variant="h4">{t("notFound.title")}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t("notFound.hint")}
      </Typography>
      <Button component={Link} to={PATHS.announcements.list} variant="contained">
        {t("notFound.backToAnnouncements")}
      </Button>
    </Box>
  );
};

export default NotFoundPage;
