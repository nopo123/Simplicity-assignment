const buildClientId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const CLIENT_ID_HEADER = "x-client-id";

export const CLIENT_ID = buildClientId();
