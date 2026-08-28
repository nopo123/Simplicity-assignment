import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import App from "./App";
import ClassicLoader from "src/components/customs/ClassicLoader";
import SnackbarCloseButton from "src/components/snackbar/SnackbarCloseButton";
import { StyledSnackbarContent } from "src/components/snackbar/StyledSnackbarContent";
import { SNACKBAR_AUTO_HIDE_MS } from "src/config/config";
import "src/i18n";
import { createAppQueryClient } from "src/lib/queryClient";
import { ThemeCssVarsProvider } from "src/providers/ThemeCssVarsProvider";
import ThemeProvider from "src/theme";

const queryClient = createAppQueryClient();
const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <ThemeProvider>
    <ThemeCssVarsProvider>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={SNACKBAR_AUTO_HIDE_MS}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          action={(snackbarKey) => (
            <SnackbarCloseButton snackbarKey={snackbarKey} />
          )}
          Components={{
            success: StyledSnackbarContent,
            error: StyledSnackbarContent,
            warning: StyledSnackbarContent,
            info: StyledSnackbarContent,
          }}
        >
          <BrowserRouter>
            <Suspense fallback={<ClassicLoader />}>
              <App />
            </Suspense>
          </BrowserRouter>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeCssVarsProvider>
  </ThemeProvider>,
);
