import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

export const useErrorSnackbar = (isError = false) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const showError = useCallback(
    (messageKey = "general.errorOccurred") =>
      enqueueSnackbar(t(messageKey), { variant: "error" }),
    [enqueueSnackbar, t],
  );

  useEffect(() => {
    if (isError) {
      showError();
    }
  }, [isError, showError]);

  return { showError };
};
