import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className + " dark"}>
        <div
          vaul-drawer-wrapper=""
          className="mx-auto max-w-6xl bg-background px-3 text-foreground"
        >
          {children}
        </div>
      </body>
    </html>
  );
}
