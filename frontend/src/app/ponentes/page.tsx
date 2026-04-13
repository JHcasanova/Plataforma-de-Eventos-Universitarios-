'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Ponente } from '@/lib/types';

export default function PaginaPonentes() {
  const [ponentes, setPonentes] = useState<Ponente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPonentes();
  }, []);

  async function cargarPonentes() {
    try {
      setCargando(true);
      const datos = await api.get<Ponente[]>('/ponentes');
      setPonentes(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ponentes');
    } finally {
      setCargando(false);
    }
  }

  async function eliminarPonente(id: number) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este ponente?')) return;
    try {
      await api.delete(`/ponentes/${id}`);
      setPonentes((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el ponente');
    }
  }

  if (cargando) return <p className="text-gray-500">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ponentes</h2>
        <a
          href="/ponentes/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Ponente
        </a>
      </div>

      {ponentes.length === 0 ? (
        <p className="text-gray-500">No hay ponentes registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-3 py-2 text-left">Nombre</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Apellido</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Email</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Áreas</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Institución</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ponentes.map((ponente) => (
                <tr key={ponente.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">{ponente.nombre}</td>
                  <td className="border border-gray-200 px-3 py-2">{ponente.apellido}</td>
                  <td className="border border-gray-200 px-3 py-2">{ponente.email}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    {ponente.areasExperticia.join(', ')}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">{ponente.institucion ?? '—'}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    <div className="flex gap-2">
                      <a
                        href={`/ponentes/${ponente.id}/editar`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Editar
                      </a>
                      <button
                        onClick={() => eliminarPonente(ponente.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
