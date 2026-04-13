'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Facultad } from '@/lib/types';

export default function PaginaNuevoEstudiante() {
  const router = useRouter();

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [facultadId, setFacultadId] = useState('');
  const [facultades, setFacultades] = useState<Facultad[]>([]);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar facultades para el select
  useEffect(() => {
    api.get<Facultad[]>('/facultades').then(setFacultades).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await api.post('/estudiantes', {
        codigo,
        nombre,
        apellido,
        email,
        facultadId: Number(facultadId),
      });
      router.push('/estudiantes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el estudiante');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Estudiante</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            placeholder="Ej: 20230001"
            className="w-full border rounded p-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: Juan"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
            placeholder="Ej: Pérez"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ej: juan.perez@uni.edu"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facultad *</label>
          <select
            value={facultadId}
            onChange={(e) => setFacultadId(e.target.value)}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar facultad...</option>
            {facultades.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={guardando}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          <a
            href="/estudiantes"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
