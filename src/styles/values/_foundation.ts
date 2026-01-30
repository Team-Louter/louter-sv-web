/**
 *
 * 예시:
 *   color: ${colors.text.black};
 *   background-color: ${colors.background.f5};
 */

export const colors = {
  main: {
    white: "#FFFFFF",
    black: "#000000",
    yellow: "#FFD600",

    normal: "#1B1E21",
    alternative: "#FFD600",
    assistive: "#FBE246",
  },

  accent: {
    primary: "#FFD600",
    secondary1: "#FFDE33",
    secondary2: "#FFE666",
    secondary3: "#FFEF99",
    secondary4: "#FFF7CC",

    assistive3: "#FDF3B8",
    assistive4: "#FEF9E0",
  },

  text: {
    white: "#FFFFFF",
    lightGray: "#B8B8B8",
    coolGray: "#8A95A0",
    dark: "#333333",
    black: "#000000",
    goldDark: "#D3AB00",
    gold: "#FFBB00",
    goldLight: "#FFD600",

    normal: "#333333",
    strong: "#15181B",
    neutral: "#727272",
    disabled: "#CACACA",
  },

  line: {
    light: "#EEEEEE",
    dark: "#333333",
    highlight: "#FFD600",

    normal: "#E2E4E1",
    neutral: "#F6F6F1",
  },

  fill: {
    white: "#FFFFFF",
    f5: "#F5F5F5",
    f3: "#F3F4F6",
    a0: "#A0A0A0",
    darkOverlay: "rgba(12, 16, 20, 0.7)",
    slate: "#4E5968",
    charcoal: "#2A2B2B",
    almostBlack: "#191A1A",
    black: "#000000",
    yellow: "#FFD600",

    normal: "#F0F0F0",
    neutral: "#EDEDED",
    alternative: "#BFBFBF",
    assistive: "#FFFFFF",
  },

  background: {
    white: "#FFFFFF",
    f5: "#F5F5F5",
    almostBlack: "#191A1A",
    yellow: "#FFD600",

    lightGray: "#FBFBFB",
  },

  state: {
    error: "#E23737",
    info: "#4B88CE",
    success: "#5DBC86",
    warning: "#FFD600",

    errorSoft: "#E25353",
    infoSoft: "#4E90DB",
    successSoft: "#2CC448",
    warningSoft: "#E19145",
  },

  calendar: {
    red: "#FC675F",
    blue: "#2CA4FB",
    black: "#191A1A",
  },
} as const;

export type colors = typeof colors;
