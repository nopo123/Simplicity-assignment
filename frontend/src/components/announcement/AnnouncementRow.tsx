import { memo, useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TruncatedText from "src/components/customs/TruncatedText";
import { TFunction } from "i18next";
import { globalStyles } from "src/styles/globalStyles";
import { AnnouncementType } from "src/types/announcement";
import { resolveCategoryLabels } from "src/utils/category/categoryLabel";
import {
  formatLastUpdate,
  formatPublicationDate,
} from "src/utils/date/dateFormat";
import { cssVar } from "src/utils/style/cssStyle";
import { DIMENSIONS } from "src/config/config";
import { icon } from "src/utils/style/svgIcon";

interface AnnouncementRowProps {
  readonly announcement: AnnouncementType;
  readonly language: string;
  readonly t: TFunction;
  readonly onEdit: (announcementId: number) => void;
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
        <TruncatedText text={announcement.title} />
      </TableCell>
      <TableCell sx={globalStyles.bodyCell}>
        <Typography variant="body2">
          {formatPublicationDate(announcement.publicationDate, language)}
        </Typography>
      </TableCell>
      <TableCell sx={globalStyles.bodyCell}>
        <Typography variant="body2">
          {formatLastUpdate(announcement.updated, language)}
        </Typography>
      </TableCell>
      <TableCell sx={globalStyles.bodyCell}>
        <TruncatedText text={categoryLabels} />
      </TableCell>
      <TableCell sx={globalStyles.actionCell}>
        <Tooltip title={t("announcements.table.edit")}>
          <IconButton
            aria-label={t("announcements.table.edit")}
            size="small"
            onClick={handleEdit}
          >
            {icon("edit", DIMENSIONS.ICON_SIZE_SMALL, DIMENSIONS.ICON_SIZE_SMALL, cssVar("text-primary"))}
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default memo(AnnouncementRow);
