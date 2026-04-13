'use client';

// Página de inicio con acceso rápido a las secciones principales

const secciones = [
  {
    titulo: 'Eventos',
    descripcion: 'Gestiona los eventos universitarios: crea, edita y consulta.',
    href: '/eventos',
    color: 'bg-blue-600',
  },
  {
    titulo: 'Espacios',
    descripcion: 'Administra los espacios físicos disponibles para eventos.',
    href: '/espacios',
    color: 'bg-purple-600',
  },
  {
    titulo: 'Ponentes',
    descripcion: 'Gestiona los ponentes y sus áreas de experticia.',
    href: '/ponentes',
    color: 'bg-green-600',
  },
  {
    titulo: 'Facultades',
    descripcion: 'Administra las facultades organizadoras de eventos.',
    href: '/facultades',
    color: 'bg-orange-600',
  },
];

export default function PaginaInicio() {
  return (
    <div className="py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Plataforma de Eventos Universitarios
        </h2>
        <p className="text-gray-600 text-lg">
          Consulta y gestiona eventos académicos, culturales y deportivos.
        </p>
      </div>

      {/* Tarjetas de acceso rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {secciones.map((seccion) => (
          <a
            key={seccion.href}
            href={seccion.href}
            className="block rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`${seccion.color} text-white rounded-md px-3 py-1 text-sm font-semibold inline-block mb-3`}>
              {seccion.titulo}
            </div>
            <p className="text-gray-600 text-sm">{seccion.descripcion}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
