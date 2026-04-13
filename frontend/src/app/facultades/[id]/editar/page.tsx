'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Facultad } from '@/lib/types';

export default function PaginaEditarFacultad() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos de la facultad al montar
  useEffect(() => {
    api.get<Facultad>(`/facultades/${id}`)
      .then((facultad) => {
        setNombre(facultad.nombre);
        setCodigo(facultad.codigo);
      })
      .catch(() => setError('Error al cargar la facultad'))
      .finally(() => setCargando(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await api.patch(`/facultades/${id}`, { nombre, codigo });
      router.push('/facultades');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la facultad');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="text-gray-500">Cargando...</p>;
  if (error && !nombre) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Facultad</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            required
            className="w-full border rounded p-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={guardando}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <a
            href="/facultades"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
