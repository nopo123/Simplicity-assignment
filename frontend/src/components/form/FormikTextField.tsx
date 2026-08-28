import { ChangeEvent, ReactNode, useCallback } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { getTextFieldStyles } from "src/styles/inputStyles";

type FormikTextFieldCustomProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string | false;
  endIcon?: ReactNode;
};

type FormikTextFieldProps = FormikTextFieldCustomProps &
  Omit<TextFieldProps, keyof FormikTextFieldCustomProps | "sx">;

export const FormikTextField = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  endIcon,
  ...props
}: FormikTextFieldProps) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    [onChange],
  );

  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      fullWidth
      autoComplete="off"
      {...props}
      sx={getTextFieldStyles(error)}
      InputProps={{
        ...(props.InputProps || {}),
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : (
          props.InputProps?.endAdornment
        ),
      }}
    />
  );
};

export default FormikTextField;
