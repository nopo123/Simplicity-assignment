import { styled } from "@mui/material/styles";
import { MaterialDesignContent } from "notistack";
import { primaryFont } from "src/theme/typography";
import { cssVar } from "src/utils/style/cssStyle";

export const StyledSnackbarContent = styled(MaterialDesignContent)({
  "&.notistack-MuiContent": {
    borderRadius: "8px",
    fontFamily: primaryFont,
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
