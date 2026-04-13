'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { TipoEvento, Espacio, Facultad } from '@/lib/types';

export default function PaginaNuevoEvento() {
  const router = useRouter();

  // Campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cupoMaximo, setCupoMaximo] = useState('');
  const [tipoEventoId, setTipoEventoId] = useState('');
  const [espacioId, setEspacioId] = useState('');
  const [facultadId, setFacultadId] = useState('');

  // Opciones para los selects
  const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [facultades, setFacultades] = useState<Facultad[]>([]);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar opciones de selects al montar
  useEffect(() => {
    Promise.all([
      api.get<TipoEvento[]>('/tipos-evento'),
      api.get<Espacio[]>('/espacios'),
      api.get<Facultad[]>('/facultades'),
    ])
      .then(([tipos, esp, fac]) => {
        setTiposEvento(tipos);
        setEspacios(esp);
        setFacultades(fac);
      })
      .catch(() => setError('Error al cargar opciones del formulario'));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await api.post('/eventos', {
        titulo,
        descripcion: descripcion || undefined,
        fechaInicio: new Date(fechaInicio).toISOString(),
        fechaFin: new Date(fechaFin).toISOString(),
        cupoMaximo: Number(cupoMaximo),
        tipoEventoId: Number(tipoEventoId),
        espacioId: Number(espacioId),
        facultadId: Number(facultadId),
      });
      router.push('/eventos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el evento');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Evento</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            maxLength={200}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label>
            <input
              type="datetime-local"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin *</label>
            <input
              type="datetime-local"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cupo máximo *</label>
          <input
            type="number"
            value={cupoMaximo}
            onChange={(e) => setCupoMaximo(e.target.value)}
            required
            min={1}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de evento *</label>
          <select
            value={tipoEventoId}
            onChange={(e) => setTipoEventoId(e.target.value)}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {tiposEvento.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Espacio *</label>
          <select
            value={espacioId}
            onChange={(e) => setEspacioId(e.target.value)}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {espacios.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre} ({e.ubicacion})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facultad *</label>
          <select
            value={facultadId}
            onChange={(e) => setFacultadId(e.target.value)}
            required
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {facultades.map((f) => (
              <option key={f.id} value={f.id}>{f.nombre}</option>
            ))}
          </select>
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
            href="/eventos"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
