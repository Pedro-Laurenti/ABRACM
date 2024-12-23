"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider {...themeProps}>
        <div className="min-h-screen flex flex-col justify-between">
          {children}
        </div>
      </ThemeProvider>
    </NextUIProvider>
  );
}
