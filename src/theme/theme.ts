"use client";

import { createTheme } from "@mui/material/styles";

/** Тёмная тема: чуть светлее фон и выше контраст текста для чтения. */
const gh = {
  canvasDefault: "#161d27",
  canvasSubtle: "#1f2938",
  borderDefault: "#3d4758",
  fgDefault: "#f0f4f8",
  fgMuted: "#a8b5c4",
  /** Акцент secondary (кнопки, chip, градиент заголовка) */
  accentBlue: "#f0f8ff",
  accentBlueLight: "#3d95f5",
  accentBlueDark: "#014a9c",
  accentGreen: "#238636",
  accentGreenBright: "#2ea043",
};

export function createAppTheme() {
  return createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: gh.accentGreenBright,
        light: "#3fb950",
        dark: gh.accentGreen,
      },
      secondary: {
        main: gh.accentBlue,
        light: gh.accentBlueLight,
        dark: gh.accentBlueDark,
      },
      background: {
        default: gh.canvasDefault,
        paper: gh.canvasSubtle,
      },
      text: {
        primary: gh.fgDefault,
        secondary: gh.fgMuted,
        disabled: "#6d7788",
      },
      divider: gh.borderDefault,
      error: {
        main: "#f85149",
      },
      action: {
        active: gh.fgDefault,
        hover: "rgba(177, 186, 196, 0.12)",
        selected: "rgba(177, 186, 196, 0.2)",
      },
    },
    shape: {
      borderRadius: 6,
    },
    typography: {
      fontFamily:
        'var(--font-inter), Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      htmlFontSize: 18,
      h4: {
        fontWeight: 600,
        letterSpacing: "-0.02em",
        fontSize: "2.0625rem",
        lineHeight: 1.25,
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.3125rem",
        lineHeight: 1.4,
      },
      subtitle1: {
        fontSize: "1.1875rem",
        lineHeight: 1.5,
      },
      body1: {
        fontSize: "1.25rem",
        lineHeight: 1.62,
        "@media (min-width:600px)": {
          fontSize: "1.5rem",
          lineHeight: 1.68,
        },
      },
      body2: {
        fontSize: "1.0625rem",
        lineHeight: 1.6,
      },
      caption: {
        fontSize: "0.9375rem",
      },
      button: {
        fontSize: "1.125rem",
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: `${gh.borderDefault} transparent`,
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "6px",
            fontSize: "1.0625rem",
          },
          sizeLarge: {
            fontSize: "1.125rem",
            paddingTop: 10,
            paddingBottom: 10,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: "1px solid",
            borderColor: gh.borderDefault,
            borderRadius: "6px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: gh.borderDefault,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: gh.fgMuted,
            },
          },
          input: {
            fontSize: "1.1875rem",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "1.125rem",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontSize: "1.0625rem",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          message: {
            fontSize: "1.1875rem",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          fullWidth: true,
        },
      },
      MuiSelect: {
        defaultProps: {
          variant: "outlined",
        },
        styleOverrides: {
          select: ({ theme }) => ({
            paddingLeft: theme.spacing(2),
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
              paddingLeft: theme.spacing(1.75),
              paddingTop: 0,
              paddingBottom: 0,
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            [theme.breakpoints.up("sm")]: {
              paddingLeft: theme.spacing(1.75),
              paddingTop: theme.spacing(1.5),
              paddingBottom: theme.spacing(1.5),
            },
          }),
        },
      },
    },
  });
}
