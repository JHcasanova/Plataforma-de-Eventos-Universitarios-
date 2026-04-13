'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Estudiante, Evento, Inscripcion } from '@/lib/types';

export default function PaginaInscripciones() {
  // Datos para los selects
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  // Selección actual
  const [estudianteId, setEstudianteId] = useState('');
  const [eventoId, setEventoId] = useState('');

  // Inscripciones del estudiante seleccionado
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [cargandoInscripciones, setCargandoInscripciones] = useState(false);
  const [inscribiendo, setInscribiendo] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Cargar estudiantes y eventos publicados al montar
  useEffect(() => {
    Promise.all([
      api.get<Estudiante[]>('/estudiantes'),
      api.get<Evento[]>('/eventos/proximos'),
    ])
      .then(([ests, evts]) => {
        setEstudiantes(ests);
        // Solo mostrar eventos PUBLICADOS en el select
        setEventos(evts.filter((e) => e.estado === 'PUBLICADO'));
      })
      .catch(() => setError('Error al cargar los datos iniciales'))
      .finally(() => setCargandoDatos(false));
  }, []);

  // Cargar inscripciones cuando cambia el estudiante seleccionado
  useEffect(() => {
    if (!estudianteId) {
      setInscripciones([]);
      return;
    }
    setCargandoInscripciones(true);
    api
      .get<Inscripcion[]>(`/inscripciones/estudiante/${estudianteId}`)
      .then(setInscripciones)
      .catch(() => setInscripciones([]))
      .finally(() => setCargandoInscripciones(false));
  }, [estudianteId]);

  async function handleInscribir(e: React.FormEvent) {
    e.preventDefault();
    if (!estudianteId || !eventoId) return;

    setError('');
    setExito('');
    setInscribiendo(true);

    try {
      await api.post('/inscripciones', {
        estudianteId: Number(estudianteId),
        eventoId: Number(eventoId),
      });
      setExito('Inscripción realizada exitosamente');
      setEventoId('');
      // Recargar inscripciones del estudiante
      const actualizadas = await api.get<Inscripcion[]>(
        `/inscripciones/estudiante/${estudianteId}`,
      );
      setInscripciones(actualizadas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al inscribirse');
    } finally {
      setInscribiendo(false);
    }
  }

  async function handleCancelar(inscripcionId: number) {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta inscripción?')) return;

    setError('');
    setExito('');

    try {
      await api.delete(`/inscripciones/${inscripcionId}`);
      setExito('Inscripción cancelada correctamente');
      // Actualizar lista local
      setInscripciones((prev) =>
        prev.map((i) =>
          i.id === inscripcionId ? { ...i, estado: 'CANCELADA' } : i,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar la inscripción');
    }
  }

  // Etiqueta de color según estado de inscripción
  function badgeEstado(estado: string) {
    const clases: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      CONFIRMADA: 'bg-green-100 text-green-800',
      CANCELADA: 'bg-red-100 text-red-800',
    };
    return clases[estado] ?? 'bg-gray-100 text-gray-800';
  }

  if (cargandoDatos) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Inscripciones</h2>

      {/* Mensajes de feedback */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {exito}
        </div>
      )}

      {/* Formulario de inscripción */}
      <form
        onSubmit={handleInscribir}
        className="bg-white border border-gray-200 rounded p-4 mb-8 space-y-4"
      >
        <h3 className="font-semibold text-gray-700">Nueva inscripción</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select de estudiante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Estudiante *
            </label>
            <select
              value={estudianteId}
              onChange={(e) => {
                setEstudianteId(e.target.value);
                setError('');
                setExito('');
              }}
              required
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar estudiante...</option>
              {estudiantes.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.apellido}, {est.nombre} — {est.codigo}
                </option>
              ))}
            </select>
          </div>

          {/* Select de evento (solo PUBLICADOS) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Evento *
            </label>
            <select
              value={eventoId}
              onChange={(e) => setEventoId(e.target.value)}
              required
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar evento...</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.titulo} — {ev.cuposDisponibles} cupos
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={inscribiendo || !estudianteId || !eventoId}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {inscribiendo ? 'Inscribiendo...' : 'Inscribirse'}
        </button>
      </form>

      {/* Tabla de inscripciones del estudiante seleccionado */}
      {estudianteId && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">
            Inscripciones del estudiante seleccionado
          </h3>

          {cargandoInscripciones ? (
            <p className="text-gray-500">Cargando inscripciones...</p>
          ) : inscripciones.length === 0 ? (
            <p className="text-gray-500">Este estudiante no tiene inscripciones.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2 text-left">Evento</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">
                      Fecha inscripción
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Estado</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inscripciones.map((ins) => (
                    <tr key={ins.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-2 font-medium">
                        {ins.evento?.titulo ?? `Evento #${ins.eventoId}`}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">
                        {new Date(ins.fechaInscripcion).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="border border-gray-200 px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${badgeEstado(ins.estado)}`}
                        >
                          {ins.estado}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-3 py-2">
                        {ins.estado !== 'CANCELADA' && (
                          <button
                            onClick={() => handleCancelar(ins.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
