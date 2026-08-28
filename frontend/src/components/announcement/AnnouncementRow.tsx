import { useCallback } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { TFunction } from "i18next";
import { CategoryChipStyled } from "src/styles/customStyledComponent";
import { commonStyles, globalStyles } from "src/styles/globalStyles";
import { AnnouncementType } from "src/types/announcement";
import { resolveCategoryLabels } from "src/utils/category/categoryLabel";
import { formatPublicationDate } from "src/utils/date/dateFormat";
import { cssVar } from "src/utils/style/cssStyle";
import { icon } from "src/utils/style/svgIcon";

interface AnnouncementRowProps {
  announcement: AnnouncementType;
  language: string;
  t: TFunction;
  onEdit: (announcementId: number) => void;
}

const AnnouncementRow = ({
  announcement,
  language,
  t,
  onEdit,
}: AnnouncementRowProps) => {
  const categoryLabels = resolveCategoryLabels(
    announcement.categories,
    language,
  );

  const handleEdit = useCallback(
    () => onEdit(announcement.id),
    [onEdit, announcement.id],
  );

  return (
    <TableRow hover>
      <TableCell sx={globalStyles.bodyCell}>
        <Typography variant="body2">{announcement.title}</Typography>
      </TableCell>
      <TableCell sx={globalStyles.bodyCell}>
        <Typography variant="body2" color="text.secondary">
          {formatPublicationDate(announcement.publicationDate)}
        </Typography>
      </TableCell>
      <TableCell sx={globalStyles.bodyCell}>
        <Typography variant="body2" color="text.secondary">
          {formatPublicationDate(announcement.updated)}
        </Typography>
      </TableCell>
      <TableCell sx={globalStyles.bodyCell}>
        <Box
          sx={{
            ...commonStyles.flexCenter,
            ...commonStyles.gap4px,
            ...commonStyles.flexWrap,
          }}
        >
          {categoryLabels.map((label) => (
            <CategoryChipStyled key={label} label={label} size="small" />
          ))}
        </Box>
      </TableCell>
      <TableCell sx={globalStyles.actionCell}>
        <Tooltip title={t("announcements.table.edit")}>
          <IconButton
            aria-label={t("announcements.table.edit")}
            size="small"
            onClick={handleEdit}
          >
            {icon("edit", 18, 18, cssVar("text-secondary"))}
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default AnnouncementRow;
