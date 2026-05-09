import React from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'FactoryMind',
  description: 'Agente RAG para Pymes Industriales',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}