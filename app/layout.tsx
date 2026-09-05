import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmPlug AI | Farm Intelligence to the Right Market",
  description: "Predictive agricultural market intelligence for Farmers and FPOs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
