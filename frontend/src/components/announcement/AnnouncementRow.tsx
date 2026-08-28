import { useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { TFunction } from "i18next";
import { globalStyles } from "src/styles/globalStyles";
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
  ).join(",");

  const handleEdit = useCallback(
    () => onEdit(announcement.id),
    [onEdit, announcement.id],
  );

  return (
    <TableRow hover>
      <TableCell sx={globalStyles.bodyCellFirst}>
        <Typography variant="body2">{announcement.title}</Typography>
      </TableCell>
      <TableCell sx={globalStyles.bodyCell}>
        <Typography variant="body2">
          {announcement.publicationDate}
        </Typography>
      </TableCell>
      <TableCell sx={globalStyles.bodyCell}>
        <Typography variant="body2">
          {formatPublicationDate(announcement.updated)}
        </Typography>
      </TableCell>
      <TableCell sx={globalStyles.bodyCell}>
        <Typography variant="body2">{categoryLabels}</Typography>
      </TableCell>
      <TableCell sx={globalStyles.actionCell}>
        <Tooltip title={t("announcements.table.edit")}>
          <IconButton
            aria-label={t("announcements.table.edit")}
            size="small"
            onClick={handleEdit}
          >
            {icon("edit", 18, 18, cssVar("text-primary"))}
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default AnnouncementRow;
