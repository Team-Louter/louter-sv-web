import * as values from "./values/token";

export const theme = {
  colors: values.colors,
  shapes: values.shapes,
  typography: {
    fontFamily: values.fontFamily,
    fontSize: values.fontSize,
    fontWeight: values.fontWeight,
  },
} as const;

export type Theme = typeof theme;