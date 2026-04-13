import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import PlayerBar from "@/components/PlayerBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "CyanCast",
  description: "Stream the vibe. Feel the beat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable}`} suppressHydrationWarning>
        <PlayerProvider>
          {children}
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
