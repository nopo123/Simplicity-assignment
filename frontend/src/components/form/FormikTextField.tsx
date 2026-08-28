import Box from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { globalStyles } from "src/styles/globalStyles";
import { getTextFieldStyles } from "src/styles/inputStyles";

type FormikTextFieldCustomProps = {
  readonly name: string;
  readonly label?: string;
  readonly error?: boolean;
  readonly helperText?: string | false;
};

type FormikTextFieldProps = FormikTextFieldCustomProps &
  Omit<TextFieldProps, keyof FormikTextFieldCustomProps | "sx" | "label">;

export const FormikTextField = ({
  name,
  label,
  error,
  helperText,
  ...props
}: FormikTextFieldProps) => (
  <Box sx={globalStyles.fieldStack}>
    {label && (
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    )}
    <TextField
      name={name}
      error={error}
      helperText={helperText}
      fullWidth
      autoComplete="off"
      {...props}
      sx={getTextFieldStyles(error)}
    />
  </Box>
);

export default FormikTextField;
