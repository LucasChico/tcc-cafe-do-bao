'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/providers/toast.provider";
import { AuthProvider } from "@/providers/auth.provider";
import { ToastContainer } from "@/components/toast-container";
import { Header } from "@/components/header";
import { PedidoProvider } from "@/providers/pedido.provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <AuthProvider>
            <PedidoProvider>
              <Header />
              <ToastContainer />
              <div className="app-container mt-2 mb-10">
                {children}
              </div>
            </PedidoProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
