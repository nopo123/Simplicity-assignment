import { ChangeEvent, useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { searchFieldStyles } from "src/styles/inputStyles";
import { cssVar } from "src/utils/style/cssStyle";
import { DIMENSIONS } from "src/config/config";
import { icon } from "src/utils/style/svgIcon";

interface SearchFieldProps {
  readonly searchTerm: string;
  readonly placeholder: string;
  readonly onSearch: (value: string) => void;
}

const SearchField = ({
  searchTerm,
  placeholder,
  onSearch,
}: SearchFieldProps) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onSearch(event.target.value),
    [onSearch],
  );

  const handleClear = useCallback(() => onSearch(""), [onSearch]);

  return (
    <TextField
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
      autoComplete="off"
      sx={searchFieldStyles}
      InputProps={{
        endAdornment: (
          <>
            {searchTerm.length > 0 && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  size="small"
                  onClick={handleClear}
                >
                  {icon("clear", DIMENSIONS.ICON_SIZE_SMALL, DIMENSIONS.ICON_SIZE_SMALL, cssVar("text-secondary"))}
                </IconButton>
              </InputAdornment>
            )}
            <InputAdornment position="end">
              {icon("search", DIMENSIONS.ICON_SIZE_SMALL, DIMENSIONS.ICON_SIZE_SMALL, cssVar("text-secondary"))}
            </InputAdornment>
          </>
        ),
      }}
    />
  );
};

export default SearchField;
