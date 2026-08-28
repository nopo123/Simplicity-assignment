import { ChangeEvent, useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { searchFieldStyles } from "src/styles/inputStyles";
import { cssVar } from "src/utils/style/cssStyle";
import { icon } from "src/utils/style/svgIcon";

interface SearchFieldProps {
  searchTerm: string;
  placeholder: string;
  onSearch: (value: string) => void;
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
      size="small"
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
                  {icon("clear", 18, 18, cssVar("text-secondary"))}
                </IconButton>
              </InputAdornment>
            )}
            <InputAdornment position="end">
              {icon("search", 18, 18, cssVar("text-secondary"))}
            </InputAdornment>
          </>
        ),
      }}
    />
  );
};

export default SearchField;
