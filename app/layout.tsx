import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LoaderProvider } from "@/context/LoaderContext"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freitas Outlet",
  description: "Loja online de calçados — Freitas Outlet",
  authors: [{ name: "Freitas Outlet Dev Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-900 text-white min-h-screen antialiased">
        {/* Contexto global */}
        <CartProvider>
          <LoaderProvider> {/* ✅ LOADER GLOBAL ADICIONADO */}
            <main className="flex flex-col min-h-screen">
              {children}
            </main>
          </LoaderProvider>
        </CartProvider>
      </body>
    </html>
  );
}
