'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Espacio } from '@/lib/types';

export default function PaginaEspacios() {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEspacios();
  }, []);

  async function cargarEspacios() {
    try {
      setCargando(true);
      const datos = await api.get<Espacio[]>('/espacios');
      setEspacios(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar espacios');
    } finally {
      setCargando(false);
    }
  }

  async function eliminarEspacio(id: number) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este espacio?')) return;
    try {
      await api.delete(`/espacios/${id}`);
      setEspacios((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el espacio');
    }
  }

  if (cargando) return <p className="text-gray-500">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Espacios</h2>
        <a
          href="/espacios/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Espacio
        </a>
      </div>

      {espacios.length === 0 ? (
        <p className="text-gray-500">No hay espacios registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-3 py-2 text-left">Nombre</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Ubicación</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Capacidad</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Tipo</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Disponible</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {espacios.map((espacio) => (
                <tr key={espacio.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 font-medium">{espacio.nombre}</td>
                  <td className="border border-gray-200 px-3 py-2">{espacio.ubicacion}</td>
                  <td className="border border-gray-200 px-3 py-2">{espacio.capacidad}</td>
                  <td className="border border-gray-200 px-3 py-2">{espacio.tipo}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${espacio.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {espacio.disponible ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    <div className="flex gap-2">
                      <a
                        href={`/espacios/${espacio.id}/editar`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Editar
                      </a>
                      <button
                        onClick={() => eliminarEspacio(espacio.id)}
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
