import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { announcementApi } from "src/api/announcement";
import { ROWS_PER_PAGE } from "src/config/config";
import {
  ANNOUNCEMENT_SORT_BY,
  AnnouncementListType,
  AnnouncementType,
  SORT_ORDER,
} from "src/types/announcement";
import { useDebouncedCallback } from "src/hooks/common/useDebouncedCallback";
import { QUERY_KEYS } from "src/hooks/common/queryKeys";
import { useErrorSnackbar } from "src/hooks/common/useErrorSnackbar";

const EMPTY_ANNOUNCEMENTS: AnnouncementType[] = [];

export const useAnnouncements = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState(ANNOUNCEMENT_SORT_BY.LAST_UPDATE);
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.DESC);
  const [page, setPage] = useState(0);

  const debouncedSetSearch = useDebouncedCallback(setSearch);

  const query = useMemo(
    () => ({
      search: search || undefined,
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
      sortBy,
      sortOrder,
      page: page + 1,
      limit: ROWS_PER_PAGE,
    }),
    [search, categoryIds, sortBy, sortOrder, page],
  );

  const {
    data: announcementList,
    isLoading,
    isError,
  } = useQuery<AnnouncementListType>({
    queryKey: QUERY_KEYS.announcements.list(query),
    queryFn: () => announcementApi.getAnnouncements(query),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useCallback(
    (value: string) => {
      setSearchInput(value);
      setPage(0);

      if (value === "") {
        debouncedSetSearch.cancel();
        setSearch("");

        return;
      }

      debouncedSetSearch(value);
    },
    [debouncedSetSearch],
  );

  const handleCategoryChange = useCallback(
    (selectedCategoryIds: number[]) => {
      debouncedSetSearch.flush();
      setCategoryIds(selectedCategoryIds);
      setPage(0);
    },
    [debouncedSetSearch],
  );

  const handleSort = useCallback(
    (field: ANNOUNCEMENT_SORT_BY) => {
      const isSameField = sortBy === field;
      const nextSortOrder =
        isSameField && sortOrder === SORT_ORDER.DESC
          ? SORT_ORDER.ASC
          : SORT_ORDER.DESC;

      setSortBy(field);
      setSortOrder(nextSortOrder);
      setPage(0);
    },
    [sortBy, sortOrder],
  );

  const handleChangePage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  useErrorSnackbar(isError);

  return {
    announcements: announcementList?.items ?? EMPTY_ANNOUNCEMENTS,
    total: announcementList?.total ?? 0,
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
  };
};
