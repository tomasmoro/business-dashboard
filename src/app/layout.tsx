import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/shared/query-provider";

export const metadata: Metadata = {
  title: "TurnosPro Dashboard",
  description:
    "Dashboard administrativo para gestión de turnos y negocios de belleza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
