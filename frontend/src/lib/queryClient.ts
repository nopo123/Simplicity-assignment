import { QueryClient } from "@tanstack/react-query";

export const createAppQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
