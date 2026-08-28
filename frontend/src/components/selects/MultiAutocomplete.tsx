import { FocusEvent, memo, SyntheticEvent, useCallback, useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import {
  AutocompleteTagsStyled,
  CategoryChipStyled,
} from "src/styles/customStyledComponent";
import {
  autocompletePopperStyles,
  getAutocompleteStyles,
} from "src/styles/inputStyles";
import { CategoryOptionType } from "src/types/category";

interface MultiAutocompleteProps {
  items: CategoryOptionType[];
  values: number[];
  handleChange: (selectedIds: number[]) => void;
  name: string;
  ariaLabel: string;
  placeholder: string;
  noOptionsText: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string | false;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

const MultiAutocomplete = ({
  items,
  values,
  handleChange,
  name,
  ariaLabel,
  placeholder,
  noOptionsText,
  disabled = false,
  error = false,
  helperText,
  onBlur,
}: MultiAutocompleteProps) => {
  const selectedItems = useMemo(
    () => items.filter((item) => values.includes(item.id)),
    [items, values],
  );

  const handleAutocompleteChange = useCallback(
    (_event: SyntheticEvent, newValue: CategoryOptionType[]) => {
      handleChange(newValue.map((item) => item.id));
    },
    [handleChange],
  );

  const isOptionEqualToValue = useCallback(
    (option: CategoryOptionType, value: CategoryOptionType) =>
      option.id === value.id,
    [],
  );

  const renderTags = useCallback(
    (
      tagValue: CategoryOptionType[],
      getTagProps: (params: { index: number }) => object,
    ) => (
      <AutocompleteTagsStyled>
        {tagValue.map((option, index) => (
          <CategoryChipStyled
            {...getTagProps({ index })}
            key={option.id}
            label={option.label}
            size="small"
          />
        ))}
      </AutocompleteTagsStyled>
    ),
    [],
  );

  const autocompleteStyles = useMemo(
    () => getAutocompleteStyles(error),
    [error],
  );

  const renderInput = useCallback(
    (params: object) => (
      <TextField
        {...params}
        name={name}
        error={error}
        onBlur={onBlur}
        placeholder={selectedItems.length === 0 ? placeholder : undefined}
        sx={autocompleteStyles}
      />
    ),
    [name, error, onBlur, placeholder, selectedItems.length, autocompleteStyles],
  );

  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <Autocomplete
        multiple
        filterSelectedOptions
        disableCloseOnSelect
        id={`${name}-autocomplete`}
        aria-label={ariaLabel}
        options={items}
        value={selectedItems}
        onChange={handleAutocompleteChange}
        isOptionEqualToValue={isOptionEqualToValue}
        renderTags={renderTags}
        renderInput={renderInput}
        disabled={disabled}
        noOptionsText={noOptionsText}
        componentsProps={{ popper: { sx: autocompletePopperStyles } }}
      />
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default memo(MultiAutocomplete);
