import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parc Astérix - Leaderboard",
  description: "Classement des meilleurs scores",
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

