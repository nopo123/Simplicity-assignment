import { useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import { SnackbarKey, useSnackbar } from "notistack";
import { DIMENSIONS } from "src/config/config";
import { icon } from "src/utils/style/svgIcon";

interface SnackbarCloseButtonProps {
  snackbarKey: SnackbarKey;
}

const SnackbarCloseButton = ({ snackbarKey }: SnackbarCloseButtonProps) => {
  const { closeSnackbar } = useSnackbar();

  const handleClose = useCallback(
    () => closeSnackbar(snackbarKey),
    [closeSnackbar, snackbarKey],
  );

  return (
    <IconButton aria-label="close" size="small" sx={{ color: "inherit" }} onClick={handleClose}>
      {icon("clear", DIMENSIONS.ICON_SIZE_SMALL, DIMENSIONS.ICON_SIZE_SMALL)}
    </IconButton>
  );
};

export default SnackbarCloseButton;
