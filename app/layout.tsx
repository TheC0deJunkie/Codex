import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logo Vectorizer Pro",
  description:
    "Convert logo images into clean, scalable SVG files directly in your browser with powerful edge and color controls."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
