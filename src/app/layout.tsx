import "material-symbols/outlined.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TumbuhKu - Sistem Informasi Pencatatan Balita & Deteksi Dini Stunting",
  description:
    "Aplikasi pemantauan pertumbuhan balita dan deteksi dini stunting untuk kader Posyandu dan orang tua.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#00652c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth overflow-x-hidden" suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col font-sans bg-surface text-on-surface overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
