import { SxProps, Theme } from "@mui/material";
import { commonStyles } from "./globalStyles";
import { DIMENSIONS, MEDIA_DOWN_SM } from "src/config/config";
import { cssVar } from "src/utils/style/cssStyle";

const placeholderStyles = {
  "& .MuiInputBase-input::placeholder": {
    color: cssVar("text-secondary"),
    opacity: 1,
  },
} as const;

const outlinedStateStyles = (error: boolean | undefined) => ({
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: error ? cssVar("error-main") : cssVar("primary-main"),
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: cssVar("error-main"),
  },
});

export const getTextFieldStyles = (
  error: boolean | undefined,
): SxProps<Theme> => ({
  ...commonStyles.fullWidth,
  ...placeholderStyles,
  ...outlinedStateStyles(error),
  "& .MuiInputBase-input": {
    color: cssVar("text-primary"),
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
  },
});

export const getAutocompleteStyles = (
  error: boolean | undefined,
): SxProps<Theme> => ({
  ...commonStyles.fullWidth,
  ...placeholderStyles,
  ...outlinedStateStyles(error),
  "& .MuiAutocomplete-input": {
    color: cssVar("text-primary"),
  },
});

export const searchFieldStyles: SxProps<Theme> = {
  ...commonStyles.fullWidth,
  ...placeholderStyles,
  maxWidth: `${DIMENSIONS.FILTER_WIDTH}px`,
  [MEDIA_DOWN_SM]: {
    maxWidth: "100%",
  },
};

export const autocompletePopperStyles = {
  "& .MuiAutocomplete-option[aria-selected='true']": {
    backgroundColor: cssVar("primary-states-selected"),
  },
} as const;
