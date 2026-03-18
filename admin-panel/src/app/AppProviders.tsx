import type { ProviderProps } from "@/types/common";
import { AuthProvider } from "@/providers/auth/AuthProvider";
import { ThemeProvider } from "@/providers/theme/ThemeProvider";
import { GlobalAlertProvider } from "@/providers/alerts/GlobalAlertProvider";

export const AppProviders = ({ children }: ProviderProps) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GlobalAlertProvider>{children}</GlobalAlertProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
