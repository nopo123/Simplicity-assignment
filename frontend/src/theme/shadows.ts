import { Shadows } from "@mui/material/styles";

const LIGHT = "31, 42, 55";

const createShadow = (
  offsetY: number,
  blur: number,
  spread: number,
  opacity: number,
): string => `0px ${offsetY}px ${blur}px ${spread}px rgba(${LIGHT}, ${opacity})`;

export const shadows = (): Shadows => {
  const elevations = Array.from({ length: 24 }, (_, index) =>
    createShadow(
      Math.round((index + 1) / 2),
      Math.round((index + 1) * 1.5),
      0,
      0.04 + index * 0.004,
    ),
  );

  return ["none", ...elevations] as Shadows;
};
