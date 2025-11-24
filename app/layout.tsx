import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Braze - Demo Leaderboard",
  description: "Real-time leaderboard powered by Braze webhooks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

