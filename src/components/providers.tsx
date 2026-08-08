"use client";

import type { ComponentProps } from "react";
import { SWRConfig } from "swr";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";

export function Providers({
  children,
  ...themeProps
}: ComponentProps<typeof ThemeProvider>) {
  return (
    <ThemeProvider {...themeProps}>
      <SWRConfig
        value={{
          dedupingInterval: 5000,
          revalidateOnFocus: true,
          revalidateOnReconnect: true,
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
