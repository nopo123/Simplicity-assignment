export type NavItemConfig = {
  readonly value: string;
  readonly path: string;
  readonly iconName: string;
  readonly labelKey: string;
};

export const NAV_CONFIG: readonly NavItemConfig[] = [
  {
    value: "announcements",
    path: "/announcements",
    iconName: "announcement",
    labelKey: "navigation.announcements",
  },
] as const;

export const ORGANIZATION_NAME = "Test city";
