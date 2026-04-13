'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Ponente } from '@/lib/types';

export default function PaginaEditarPonente() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [areas, setAreas] = useState('');
  const [institucion, setInstitucion] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del ponente al montar
  useEffect(() => {
    api.get<Ponente>(`/ponentes/${id}`)
      .then((ponente) => {
        setNombre(ponente.nombre);
        setApellido(ponente.apellido);
        setEmail(ponente.email);
        setAreas(ponente.areasExperticia.join(', '));
        setInstitucion(ponente.institucion ?? '');
      })
      .catch(() => setError('Error al cargar el ponente'))
      .finally(() => setCargando(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const areasExperticia = areas
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    if (areasExperticia.length === 0) {
      setError('Debes ingresar al menos un área de experticia');
      return;
    }

    setGuardando(true);
    try {
      await api.patch(`/ponentes/${id}`, {
        nombre,
        apellido,
        email,
        areasExperticia,
        institucion: institucion || undefined,
      });
      router.push('/ponentes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el ponente');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="text-gray-500">Cargando...</p>;
  if (error && !nombre) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Ponente</h2>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Áreas de experticia * <span className="text-gray-400 font-normal">(separadas por coma)</span>
          </label>
          <input
            type="text"
            value={areas}
            onChange={(e) => setAreas(e.target.value)}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
          <input
            type="text"
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            href="/ponentes"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
