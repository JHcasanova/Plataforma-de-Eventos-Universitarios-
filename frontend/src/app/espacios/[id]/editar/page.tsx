'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Espacio, TipoEspacio } from '@/lib/types';

const tiposEspacio: TipoEspacio[] = ['AULA', 'AUDITORIO', 'LABORATORIO', 'CANCHA', 'OTRO'];

export default function PaginaEditarEspacio() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [tipo, setTipo] = useState<TipoEspacio>('AULA');
  const [disponible, setDisponible] = useState(true);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del espacio al montar
  useEffect(() => {
    api.get<Espacio>(`/espacios/${id}`)
      .then((espacio) => {
        setNombre(espacio.nombre);
        setUbicacion(espacio.ubicacion);
        setCapacidad(String(espacio.capacidad));
        setTipo(espacio.tipo);
        setDisponible(espacio.disponible);
      })
      .catch(() => setError('Error al cargar el espacio'))
      .finally(() => setCargando(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await api.patch(`/espacios/${id}`, {
        nombre,
        ubicacion,
        capacidad: Number(capacidad),
        tipo,
        disponible,
      });
      router.push('/espacios');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el espacio');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="text-gray-500">Cargando...</p>;
  if (error && !nombre) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Espacio</h2>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
          <input
            type="number"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            required
            min={1}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoEspacio)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tiposEspacio.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="disponible"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="disponible" className="text-sm font-medium text-gray-700">
            Disponible
          </label>
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
            href="/espacios"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
