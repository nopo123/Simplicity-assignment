import { styled } from "@mui/material/styles";
import { MaterialDesignContent } from "notistack";
import { cssVar } from "src/utils/style/cssStyle";

export const StyledSnackbarContent = styled(MaterialDesignContent)({
  "&.notistack-MuiContent": {
    borderRadius: "8px",
    fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif",
  },
  "&.notistack-MuiContent-success": {
    backgroundColor: cssVar("success-darker"),
    color: cssVar("common-white"),
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: cssVar("error-darker"),
    color: cssVar("common-white"),
  },
  "&.notistack-MuiContent-warning": {
    backgroundColor: cssVar("warning-darker"),
    color: cssVar("common-white"),
  },
  "&.notistack-MuiContent-info": {
    backgroundColor: cssVar("info-darker"),
    color: cssVar("common-white"),
  },
});
