import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description: "PrintFlow",
  title: "PrintFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
      lang="pt-BR"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Providers
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
