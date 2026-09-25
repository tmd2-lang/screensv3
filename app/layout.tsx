import type { Metadata, Viewport } from "next";
import "./fonts.css";

export const metadata: Metadata = {
  title: "Ligo Lab — Exploration 03",
  description:
    "Interactive feed units rendered inside the real Ligo feed UI, on one week of real Georgetown posts.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
