'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Estudiante, Facultad } from '@/lib/types';

export default function PaginaEditarEstudiante() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [facultadId, setFacultadId] = useState('');
  const [facultades, setFacultades] = useState<Facultad[]>([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del estudiante y facultades al montar
  useEffect(() => {
    Promise.all([
      api.get<Estudiante>(`/estudiantes/${id}`),
      api.get<Facultad[]>('/facultades'),
    ])
      .then(([est, facs]) => {
        setCodigo(est.codigo);
        setNombre(est.nombre);
        setApellido(est.apellido);
        setEmail(est.email);
        setFacultadId(String(est.facultadId));
        setFacultades(facs);
      })
      .catch(() => setError('Error al cargar los datos'))
      .finally(() => setCargando(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await api.patch(`/estudiantes/${id}`, {
        codigo,
        nombre,
        apellido,
        email,
        facultadId: Number(facultadId),
      });
      router.push('/estudiantes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estudiante');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="text-gray-500">Cargando...</p>;
  if (error && !nombre) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Estudiante</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
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
            {guardando ? 'Guardando...' : 'Guardar cambios'}
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
