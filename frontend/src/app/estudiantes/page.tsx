'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Estudiante } from '@/lib/types';

export default function PaginaEstudiantes() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  async function cargarEstudiantes() {
    try {
      setCargando(true);
      const datos = await api.get<Estudiante[]>('/estudiantes');
      setEstudiantes(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estudiantes');
    } finally {
      setCargando(false);
    }
  }

  async function eliminarEstudiante(id: number) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) return;
    try {
      await api.delete(`/estudiantes/${id}`);
      setEstudiantes((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el estudiante');
    }
  }

  if (cargando) return <p className="text-gray-500">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Estudiantes</h2>
        <a
          href="/estudiantes/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Estudiante
        </a>
      </div>

      {estudiantes.length === 0 ? (
        <p className="text-gray-500">No hay estudiantes registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-3 py-2 text-left">Código</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Nombre</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Apellido</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Email</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Facultad</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr key={est.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 font-mono text-xs">
                    {est.codigo}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">{est.nombre}</td>
                  <td className="border border-gray-200 px-3 py-2">{est.apellido}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{est.email}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    {est.facultad?.nombre ?? '—'}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    <div className="flex gap-2">
                      <a
                        href={`/estudiantes/${est.id}/editar`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Editar
                      </a>
                      <button
                        onClick={() => eliminarEstudiante(est.id)}
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
