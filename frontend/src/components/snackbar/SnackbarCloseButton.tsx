import { useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import { SnackbarKey, useSnackbar } from "notistack";
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
      {icon("clear", 18, 18)}
    </IconButton>
  );
};

export default SnackbarCloseButton;
