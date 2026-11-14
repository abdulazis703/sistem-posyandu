import "material-symbols/outlined.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TumbuhKu - Sistem Informasi Pencatatan Balita & Deteksi Dini Stunting",
  description:
    "Aplikasi pemantauan pertumbuhan balita dan deteksi dini stunting untuk kader Posyandu dan orang tua.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
