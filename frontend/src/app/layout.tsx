'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          <header className="bg-primario text-white p-4">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="text-xl font-bold">Eventos Universitarios</h1>
              <ul className="flex gap-6">
                <li>
                  <a href="/" className="hover:underline">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/eventos" className="hover:underline">
                    Eventos
                  </a>
                </li>
                <li>
                  <a href="/espacios" className="hover:underline">
                    Espacios
                  </a>
                </li>
                <li>
                  <a href="/ponentes" className="hover:underline">
                    Ponentes
                  </a>
                </li>
                <li>
                  <a href="/facultades" className="hover:underline">
                    Facultades
                  </a>
                </li>
                <li>
                  <a href="/estudiantes" className="hover:underline">
                    Estudiantes
                  </a>
                </li>
                <li>
                  <a href="/inscripciones" className="hover:underline">
                    Inscripciones
                  </a>
                </li>
              </ul>
            </nav>
          </header>
          <main className="max-w-7xl mx-auto p-6">{children}</main>
          <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600 mt-8">
            © {new Date().getFullYear()} Plataforma de Eventos Universitarios
          </footer>
        </QueryClientProvider>
      </body>
    </html>
  );
}
