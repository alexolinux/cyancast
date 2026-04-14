import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import PlayerBar from "@/components/PlayerBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-orbitron" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#030308",
};

export const metadata: Metadata = {
  title: "CyanCast",
  description: "Stream the vibe. Feel the beat.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CyanCast",
  },
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
