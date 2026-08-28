import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { io } from "socket.io-client";
import { QUERY_KEYS } from "src/hooks/common/queryKeys";
import { BACKEND_HOST } from "src/lib/lib";
import { AnnouncementType } from "src/types/announcement";

const ANNOUNCEMENT_NAMESPACE = "announcements";
const ANNOUNCEMENT_CREATED_MESSAGE = "announcementCreated";

export const useAnnouncementNotifications = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(`${BACKEND_HOST}/${ANNOUNCEMENT_NAMESPACE}`, {
      transports: ["websocket"],
    });

    socket.on(
      ANNOUNCEMENT_CREATED_MESSAGE,
      (announcement: AnnouncementType) => {
        enqueueSnackbar(
          t("announcements.notifications.created", {
            title: announcement.title,
          }),
          { variant: "info" },
        );
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.announcements.all,
        });
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [enqueueSnackbar, t, queryClient]);
};
