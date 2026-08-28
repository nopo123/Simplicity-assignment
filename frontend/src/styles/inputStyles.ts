import { SxProps, Theme } from "@mui/material";
import { DIMENSIONS, MEDIA_DOWN_SM } from "src/config/config";
import { commonStyles } from "./globalStyles";
import { cssVar } from "src/utils/style/cssStyle";

export const getTextFieldStyles = (
  error: boolean | undefined,
): SxProps<Theme> => ({
  ...commonStyles.fullWidth,
  "& .MuiInputBase-input": {
    color: cssVar("text-primary"),
  },
  "& .MuiInputBase-input::placeholder": {
    color: cssVar("text-secondary"),
    opacity: 1,
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: error ? cssVar("error-main") : cssVar("primary-main"),
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: cssVar("error-main"),
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
  },
});

export const getAutocompleteStyles = (
  error: boolean | undefined,
): SxProps<Theme> => ({
  ...commonStyles.fullWidth,
  "& .MuiAutocomplete-input": {
    color: cssVar("text-primary"),
  },
  "& .MuiInputBase-input::placeholder": {
    color: cssVar("text-secondary"),
    opacity: 1,
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: error ? cssVar("error-main") : cssVar("primary-main"),
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: cssVar("error-main"),
  },
});

export const searchFieldStyles: SxProps<Theme> = {
  ...commonStyles.fullWidth,
  maxWidth: `${DIMENSIONS.FILTER_WIDTH}px`,
  [MEDIA_DOWN_SM]: {
    maxWidth: "100%",
  },
  "& .MuiInputBase-input::placeholder": {
    color: cssVar("text-secondary"),
    opacity: 1,
  },
};

export const autocompletePopperStyles = {
  "& .MuiAutocomplete-option[aria-selected='true']": {
    backgroundColor: cssVar("primary-states-selected"),
  },
} as const;
