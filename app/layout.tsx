import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import PlayerBar from "@/components/player/PlayerBar";
import Providers from "@/components/layout/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RadioWorld — Stream Live Radio from Anywhere on Earth",
  description: "Stream 30,000+ live radio stations from every country. Free, no signup required.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-950 text-white antialiased`}>
        <Providers>
          <Header />
          <main className="pb-28">{children}</main>
          <PlayerBar />
        </Providers>
      </body>
    </html>
  );
}
