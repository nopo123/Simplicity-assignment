import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { announcementApi } from "src/api/announcement";
import {
  AnnouncementType,
  CreateAnnouncementType,
} from "src/types/announcement";

interface UseAnnouncementDetailProps {
  announcementId?: number;
}

export const useAnnouncementDetail = ({
  announcementId,
}: UseAnnouncementDetailProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: announcement,
    isLoading,
    isError,
  } = useQuery<AnnouncementType>({
    queryKey: ["announcement", announcementId],
    queryFn: () => announcementApi.getAnnouncement(announcementId),
    enabled: announcementId != null,
  });

  const invalidateAndLeave = async () => {
    await queryClient.invalidateQueries({ queryKey: ["announcements"] });
    navigate("/announcements");
  };

  const createMutation = useMutation({
    mutationFn: (values: CreateAnnouncementType) =>
      announcementApi.createAnnouncement(values),
    onSuccess: async () => {
      enqueueSnackbar(t("announcements.form.created"), { variant: "success" });
      await invalidateAndLeave();
    },
    onError: () => {
      enqueueSnackbar(t("general.errorOccurred"), { variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: CreateAnnouncementType) =>
      announcementApi.updateAnnouncement(announcementId, values),
    onSuccess: async (updatedAnnouncement) => {
      enqueueSnackbar(t("announcements.form.updated"), { variant: "success" });
      queryClient.setQueryData(
        ["announcement", announcementId],
        updatedAnnouncement,
      );
      await invalidateAndLeave();
    },
    onError: () => {
      enqueueSnackbar(t("general.errorOccurred"), { variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => announcementApi.deleteAnnouncement(announcementId),
    onSuccess: async () => {
      enqueueSnackbar(t("announcements.form.deleted"), { variant: "success" });
      await invalidateAndLeave();
    },
    onError: () => {
      enqueueSnackbar(t("general.errorOccurred"), { variant: "error" });
    },
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar(t("announcements.form.notFound"), { variant: "error" });
      navigate("/announcements");
    }
  }, [isError, enqueueSnackbar, t, navigate]);

  return {
    announcement,
    isLoading,
    saveAnnouncement: announcementId
      ? updateMutation.mutate
      : createMutation.mutate,
    deleteAnnouncement: deleteMutation.mutate,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
