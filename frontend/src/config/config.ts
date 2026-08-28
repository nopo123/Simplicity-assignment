export const DEBOUNCE_MS = 300;

export const ROWS_PER_PAGE = 10;

export const SNACKBAR_AUTO_HIDE_MS = 5000;

export const BREAKPOINTS = {
  SM: 600,
  MD: 900,
} as const;

export const MEDIA_DOWN_SM = `@media (max-width:${BREAKPOINTS.SM}px)`;
export const MEDIA_DOWN_MD = `@media (max-width:${BREAKPOINTS.MD}px)`;

export const DIMENSIONS = {
  NAV_WIDTH: 240,
  ICON_SIZE: 20,
  ICON_SIZE_SMALL: 18,
  NAV_ITEM_HEIGHT: 44,
  NAV_AVATAR_SIZE: 32,
  CONTENT_HEADER_HEIGHT: 64,
  FORM_MAX_WIDTH: 640,
  TABLE_MIN_WIDTH: 760,
  FILTER_WIDTH: 320,
} as const;
