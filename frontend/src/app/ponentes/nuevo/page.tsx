'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function PaginaNuevoPonente() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  // Las áreas se ingresan como texto separado por comas
  const [areas, setAreas] = useState('');
  const [institucion, setInstitucion] = useState('');

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Convertir el texto de áreas a un array, filtrando entradas vacías
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
      await api.post('/ponentes', {
        nombre,
        apellido,
        email,
        areasExperticia,
        institucion: institucion || undefined,
      });
      router.push('/ponentes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el ponente');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Ponente</h2>

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
            placeholder="Ej: Inteligencia Artificial, Machine Learning"
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
            {guardando ? 'Guardando...' : 'Guardar'}
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
