import { css } from "styled-components";
import { fontSize, fontWeight, fontFamily } from "./_typography";

type Type = keyof typeof fontSize;
type Weight = keyof typeof fontWeight;

export const typography = <T extends Type>(
  type: T,
  size: keyof typeof fontSize[T],
  weight: Weight
) => css`
  font-size: ${
    (fontSize[type] as Record<string, string>)[size as string]
  };
  font-weight: ${fontWeight[weight]};
  font-family: ${fontFamily.system};
`;