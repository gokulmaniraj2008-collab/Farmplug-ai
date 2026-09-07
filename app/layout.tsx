import type { Metadata } from "next";
import "./globals.css";
import LogoutButton from "@/components/logout-button";

export const metadata: Metadata = {
  title: "FarmPlug AI | Farm Intelligence to Market",
  description: "An AI-enabled agricultural platform connecting farm intelligence, produce listings, buyers, logistics and transparent market workflows.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <LogoutButton />
      </body>
    </html>
  );
}
