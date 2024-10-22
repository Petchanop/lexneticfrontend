import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export const metadata: Metadata = {
  title: "Todo lexnetic",
  description: "Lexnetic test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeSwitcher />
          <main className="bg-background h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

