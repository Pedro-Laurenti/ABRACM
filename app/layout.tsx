import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <header>
            <Navbar />
          </header>
          <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow min-h-screen">
            {children}
          </main>
          <footer className="w-full flex items-center justify-around py-3">
            <img
              alt="Breathing app icon"
              src="/logo.svg"
              className="w-50 h-50"
            />
            <div className="flex flex-col h-auto">
              <div>Av. Juscelino Kubitscheck, 500</div>
              <div>Bairro Jundiaí, Anápolis / GO</div>
              <div>Cep: 75110-390</div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}