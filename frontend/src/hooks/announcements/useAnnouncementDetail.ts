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
} from "src/types/announcement";

interface UseAnnouncementDetailProps {
  announcementId?: number;
  onLeave: () => void;
}

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
  } = useQuery<AnnouncementType>({
    queryKey: QUERY_KEYS.announcements.detail(announcementId),
    queryFn: () => announcementApi.getAnnouncement(announcementId),
    enabled: announcementId != null,
  });

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
    mutationFn: (values: CreateAnnouncementType) =>
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

  useEffect(() => {
    if (isError) {
      showError("announcements.form.notFound");
      onLeave();
    }
  }, [isError, showError, onLeave]);

  return {
    announcement,
    isLoading,
    saveAnnouncement: announcementId
      ? updateMutation.mutate
      : createMutation.mutate,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
};
