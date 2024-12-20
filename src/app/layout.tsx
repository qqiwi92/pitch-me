import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast/toaster";
import QueryProvider from "@/components/utils/providers/queryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import Header from "@/components/ui/header";
import { ListProvider } from "@/components/utils/providers/listProvider";
import { Suspense } from "react";
const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "pitch-me",
  description:
    "Make you presentation go swimmingly with pitch-me tool. App for preparing for public speeches.",
    // "Make you presentation go pitch-me. App for preparing for public speeches.",
  openGraph: {
    title: "pitch-me",
    description:
      "Make you presentation go pitch-me. App for preparing for public speeches.",
    url: "https://pitch-me.dimalevkin.ru",
    siteName: "https://pitch-me.dimalevkin.ru",
    images: [
      {
        url: "https://pitch-me.dimalevkin.ru/og.jpg",
        width: 1000,
        height: 1000,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "pitch-me",
    "pitch-me ai",
    "ai",
    "presentation",
    "powerpoint",
    "keynote",
    "keynote presentation",
    "prepare for presentation",
    "pptx",
    "smother",
    "public speeches",
    "how to present",
    "easy presenation",
    "dima levkin",
    "dimalevkin",
    "dmitry levkin",
    "dmitry levkin",
    "presentation with ai",
    "app for presentation",
    "app for preparing for public speeches",
    "train my presentation",
    "soft skills",
    "speech",
    "public speech",
    "preparing for speeches",
    "generate presenation",
    "более плавный",
    "более плавный ии",
    "искусственный интеллект",
    "презентация",
    "powerpoint",
    "keynote",
    "презентация keynote",
    "подготовка к презентации",
    "pptx",
    "smother",
    "публичные выступления",
    "как презентовать",
    "простая презентация",
    "дима Левкин",
    "дималевкин",
    "дмитрий Левкин",
    "дмитрий Левкин",
    "презентация с использованием искусственного интеллекта",
    "приложение для презентации",
    "приложение для подготовки к публичным выступлениям",
    "тренирую свою презентацию",
    "мягкие навыки",
    "речь",
    "публичное выступление",
    "подготовка к выступлениям",
    "создание презентации",
    "glatter",
    "glattere ki",
    "ai",
    "Präsentation",
    "powerpoint",
    "Keynote",
    "Keynote-Präsentation",
    "Vorbereitung auf die Präsentation",
    "pptx",
    "ersticken",
    "öffentliche Reden",
    "Präsentieren",
    "einfache Präsentation",
    "dima Levkin",
    "dimalevkin",
    "dmitry levkin",
    "dmitry levkin",
    "Präsentation mit KI",
    "App für die Präsentation",
    "App zur Vorbereitung auf öffentliche Reden",
    "Meine Präsentation trainieren",
    "Soft Skills",
    "Rede",
    "öffentliche Rede",
    "Vorbereitung auf Reden",
    "Präsentation generieren",
    "Präsentation mit KI",
    "App für die Präsentation",
    "App zur Vorbereitung auf öffentliche Reden",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="remove-scrollbar bg-background">
      <body
        className={
          montserrat.className +
          " remove-scrollbar min-h-[100vh] bg-background dark"
        }
      >
        <QueryProvider>
          <Suspense>
            <NuqsAdapter>
              <ListProvider>
                <div
                  vaul-drawer-wrapper=""
                  className="remove-scrollbar mx-auto max-w-6xl bg-background px-3 text-foreground"
                >
                  <Header />
                  <Suspense>{children}</Suspense>
                </div>
              </ListProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </NuqsAdapter>
          </Suspense>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
