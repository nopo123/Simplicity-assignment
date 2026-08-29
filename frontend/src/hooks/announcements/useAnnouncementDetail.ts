import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { announcementApi } from "src/api/announcement";
import { QUERY_KEYS } from "src/hooks/common/queryKeys";
import { useErrorSnackbar } from "src/hooks/common/useErrorSnackbar";
import {
  AnnouncementType,
  CreateAnnouncementType,
  UpdateAnnouncementType,
} from "src/types/announcement";
import { isNotFoundError } from "src/utils/api/apiError";

interface UseAnnouncementDetailProps {
  readonly announcementId: number | null;
  readonly onLeave: () => void;
}

const DETAIL_RETRY_LIMIT = 1;

export const useAnnouncementDetail = ({
  announcementId,
  onLeave,
}: UseAnnouncementDetailProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showError } = useErrorSnackbar();

  const {
    data: announcement,
    isLoading,
    isError,
    error,
  } = useQuery<AnnouncementType>({
    queryKey: QUERY_KEYS.announcements.detail(announcementId),
    queryFn: () => announcementApi.getAnnouncement(announcementId),
    enabled: announcementId != null,
    retry: (failureCount, queryError) =>
      !isNotFoundError(queryError) && failureCount < DETAIL_RETRY_LIMIT,
  });

  const isNotFound = isNotFoundError(error);

  const invalidateAndLeave = async () => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.announcements.all,
    });
    onLeave();
  };

  const createMutation = useMutation({
    mutationFn: (values: CreateAnnouncementType) =>
      announcementApi.createAnnouncement(values),
    onSuccess: invalidateAndLeave,
    onError: () => showError(),
  });

  const updateMutation = useMutation({
    mutationFn: (values: UpdateAnnouncementType) =>
      announcementApi.updateAnnouncement(announcementId, values),
    onSuccess: async (updatedAnnouncement) => {
      enqueueSnackbar(t("announcements.form.updated"), { variant: "success" });
      queryClient.setQueryData(
        QUERY_KEYS.announcements.detail(announcementId),
        updatedAnnouncement,
      );
      await invalidateAndLeave();
    },
    onError: () => showError(),
  });

  const saveAnnouncement = announcementId
    ? updateMutation.mutateAsync
    : createMutation.mutateAsync;

  useEffect(() => {
    if (isError && !isNotFound) {
      showError();
      onLeave();
    }
  }, [isError, isNotFound, showError, onLeave]);

  return {
    announcement,
    isLoading,
    isNotFound,
    saveAnnouncement,
  };
};
