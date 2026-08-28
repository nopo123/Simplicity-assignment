export const getEnv = (key: string): string | undefined =>
  import.meta.env[key] as string | undefined;
