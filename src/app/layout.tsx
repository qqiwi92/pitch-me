import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast/toaster";
import Providers from "@/components/utills/Providers";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Smoother",
  description: "App for preparing for public speeches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className + " dark"}>
        <Providers>
          <div
            vaul-drawer-wrapper=""
            className="mx-auto max-w-6xl bg-background px-3 text-foreground"
          >
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
