import { SxProps, Theme } from "@mui/material";
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
  "& .MuiFormHelperText-root.Mui-error": {
    color: cssVar("error-main"),
  },
});

export const getAutocompleteStyles = (
  error: boolean | undefined,
): SxProps<Theme> => ({
  ...commonStyles.fullWidth,
  "& .MuiAutocomplete-input": {
    color: cssVar("text-primary"),
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
  maxWidth: "320px",
  "& .MuiInputBase-input::placeholder": {
    color: cssVar("text-secondary"),
    opacity: 1,
  },
};

export const autocompletePopperStyles = {
  "& .MuiAutocomplete-listbox": {
    maxHeight: "260px",
  },
  "& .MuiAutocomplete-option[aria-selected='true']": {
    backgroundColor: cssVar("primary-states-selected"),
  },
} as const;
