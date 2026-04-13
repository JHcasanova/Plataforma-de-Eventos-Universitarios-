'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Facultad } from '@/lib/types';

export default function PaginaFacultades() {
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarFacultades();
  }, []);

  async function cargarFacultades() {
    try {
      setCargando(true);
      const datos = await api.get<Facultad[]>('/facultades');
      setFacultades(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar facultades');
    } finally {
      setCargando(false);
    }
  }

  async function eliminarFacultad(id: number) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta facultad?')) return;
    try {
      await api.delete(`/facultades/${id}`);
      setFacultades((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar la facultad');
    }
  }

  if (cargando) return <p className="text-gray-500">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Facultades</h2>
        <a
          href="/facultades/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nueva Facultad
        </a>
      </div>

      {facultades.length === 0 ? (
        <p className="text-gray-500">No hay facultades registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-3 py-2 text-left">Nombre</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Código</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facultades.map((facultad) => (
                <tr key={facultad.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 font-medium">{facultad.nombre}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {facultad.codigo}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    <div className="flex gap-2">
                      <a
                        href={`/facultades/${facultad.id}/editar`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Editar
                      </a>
                      <button
                        onClick={() => eliminarFacultad(facultad.id)}
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
