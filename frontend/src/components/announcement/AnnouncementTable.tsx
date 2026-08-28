import { MouseEvent, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import { TFunction } from "i18next";
import AnnouncementRow from "./AnnouncementRow";
import { buildAnnouncementColumns } from "./config/announcementColumns";
import { ROWS_PER_PAGE } from "src/config/config";
import { globalStyles } from "src/styles/globalStyles";
import {
  ANNOUNCEMENT_SORT_BY,
  AnnouncementType,
  SORT_ORDER,
} from "src/types/announcement";

interface AnnouncementTableProps {
  announcements: AnnouncementType[];
  total: number;
  page: number;
  sortBy: ANNOUNCEMENT_SORT_BY;
  sortOrder: SORT_ORDER;
  language: string;
  t: TFunction;
  onSort: (field: ANNOUNCEMENT_SORT_BY) => void;
  onChangePage: (page: number) => void;
  onEdit: (announcementId: number) => void;
}

const AnnouncementTable = ({
  announcements,
  total,
  page,
  sortBy,
  sortOrder,
  language,
  t,
  onSort,
  onChangePage,
  onEdit,
}: AnnouncementTableProps) => {
  const columns = useMemo(() => buildAnnouncementColumns(t), [t]);

  const sortDirection = sortOrder === SORT_ORDER.ASC ? "asc" : "desc";

  const handleChangePage = useCallback(
    (_event: MouseEvent<HTMLButtonElement> | null, nextPage: number) =>
      onChangePage(nextPage),
    [onChangePage],
  );

  const handleSortClick = useCallback(
    (field: ANNOUNCEMENT_SORT_BY) => () => onSort(field),
    [onSort],
  );

  return (
    <Box>
      <TableContainer sx={globalStyles.tableContainer}>
        <Table sx={globalStyles.table}>
          <TableHead>
            <TableRow>
              {columns.map((column, columnIndex) => (
                <TableCell
                  key={column.key}
                  sx={
                    columnIndex === 0
                      ? globalStyles.headerCellFirst
                      : globalStyles.headerCell
                  }
                >
                  {column.sortBy ? (
                    <TableSortLabel
                      active={sortBy === column.sortBy}
                      direction={
                        sortBy === column.sortBy ? sortDirection : "asc"
                      }
                      onClick={handleSortClick(column.sortBy)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              <TableCell sx={globalStyles.actionCell} />
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((announcement) => (
              <AnnouncementRow
                key={announcement.id}
                announcement={announcement}
                language={language}
                t={t}
                onEdit={onEdit}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {announcements.length === 0 && (
        <Box sx={globalStyles.emptyState}>
          <Typography variant="subtitle1">
            {t("announcements.table.emptyTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("announcements.table.emptyHint")}
          </Typography>
        </Box>
      )}

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={ROWS_PER_PAGE}
        rowsPerPageOptions={[ROWS_PER_PAGE]}
        sx={globalStyles.pagination}
      />
    </Box>
  );
};

export default AnnouncementTable;
