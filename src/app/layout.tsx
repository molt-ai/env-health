import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnviroHealth — Environmental Health Report",
  description: "Enter an address to get a comprehensive environmental health profile: air quality, water safety, toxic sites, health outcomes, and natural hazards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
