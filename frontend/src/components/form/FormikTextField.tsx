import { ChangeEvent, useCallback } from "react";
import Box from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { commonStyles } from "src/styles/globalStyles";
import { getTextFieldStyles } from "src/styles/inputStyles";

type FormikTextFieldCustomProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string | false;
};

type FormikTextFieldProps = FormikTextFieldCustomProps &
  Omit<TextFieldProps, keyof FormikTextFieldCustomProps | "sx" | "label">;

export const FormikTextField = ({
  name,
  value,
  onChange,
  label,
  error,
  helperText,
  ...props
}: FormikTextFieldProps) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    [onChange],
  );

  return (
    <Box sx={{ ...commonStyles.flexColumn, ...commonStyles.gap8px }}>
      {label && (
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      )}
      <TextField
        name={name}
        value={value}
        onChange={handleChange}
        error={error}
        helperText={helperText}
        fullWidth
        autoComplete="off"
        {...props}
        sx={getTextFieldStyles(error)}
      />
    </Box>
  );
};

export default FormikTextField;
