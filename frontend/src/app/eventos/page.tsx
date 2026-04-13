'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Evento, PaginatedResult } from '@/lib/types';

// Colores por estado del evento
const colorEstado: Record<string, string> = {
  BORRADOR: 'bg-gray-100 text-gray-700',
  PUBLICADO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-700',
  FINALIZADO: 'bg-blue-100 text-blue-700',
};

export default function PaginaEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Cargar lista de eventos al montar el componente
  useEffect(() => {
    cargarEventos();
  }, []);

  async function cargarEventos() {
    try {
      setCargando(true);
      const resultado = await api.get<PaginatedResult<Evento>>('/eventos');
      setEventos(resultado.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos');
    } finally {
      setCargando(false);
    }
  }

  async function eliminarEvento(id: number) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
    try {
      await api.delete(`/eventos/${id}`);
      setEventos((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el evento');
    }
  }

  if (cargando) return <p className="text-gray-500">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Eventos</h2>
        <a
          href="/eventos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Evento
        </a>
      </div>

      {eventos.length === 0 ? (
        <p className="text-gray-500">No hay eventos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 px-3 py-2 text-left">Título</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Fecha inicio</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Espacio</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Facultad</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Tipo</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Estado</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Cupos</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 font-medium">{evento.titulo}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    {new Date(evento.fechaInicio).toLocaleDateString('es-PE')}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">{evento.espacio?.nombre}</td>
                  <td className="border border-gray-200 px-3 py-2">{evento.facultad?.nombre}</td>
                  <td className="border border-gray-200 px-3 py-2">{evento.tipoEvento?.nombre}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorEstado[evento.estado]}`}>
                      {evento.estado}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-3 py-2">{evento.cuposDisponibles}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    <div className="flex gap-2">
                      <a
                        href={`/eventos/${evento.id}/editar`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Editar
                      </a>
                      <button
                        onClick={() => eliminarEvento(evento.id)}
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
