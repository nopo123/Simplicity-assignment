import { alpha, Theme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import "./types/types";
import { cssVar } from "src/utils/style/cssStyle";

export function overrides(theme: Theme) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
        },
        body: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          backgroundColor: theme.palette.background.paper,
        },
        "#root": {
          width: "100%",
          height: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingLeft: 20,
          paddingRight: 20,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          color: theme.palette.primary.contrastText,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        },
        sizeLarge: {
          minHeight: 44,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: theme.customShadows.card,
          borderRadius: Number(theme.shape.borderRadius) * 1.5,
          position: "relative",
          zIndex: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation8: {
          boxShadow: theme.customShadows.dropdown,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.grey[300],
          },
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: theme.palette.grey[400],
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderWidth: 1,
            borderColor: theme.palette.primary.main,
          },
          [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: alpha(theme.palette.grey[500], 0.24),
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: cssVar("text-secondary"),
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
        },
        head: {
          color: theme.palette.text.primary,
          fontWeight: 700,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          "&:hover": {
            color: theme.palette.text.primary,
          },
          "&.Mui-active": {
            color: theme.palette.text.primary,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: theme.palette.grey[150],
          color: theme.palette.text.primary,
          fontWeight: 400,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.common.white,
          backgroundImage: "none",
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: Number(theme.shape.borderRadius),
          boxShadow: theme.customShadows.dropdown,
          marginTop: 4,
        },
        listbox: {
          maxHeight: 260,
          padding: 4,
        },
        option: {
          borderRadius: 6,
          minHeight: 36,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[900],
        },
      },
    },
  };
}
