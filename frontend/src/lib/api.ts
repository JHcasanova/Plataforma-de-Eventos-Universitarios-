// Cliente HTTP para comunicación con la API de NestJS

const urlBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type OpcionesFetch = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

/**
 * Función principal para realizar peticiones HTTP a la API.
 * Agrega la URL base automáticamente y maneja errores de respuesta.
 */
export async function apiFetch<T = unknown>(
  ruta: string,
  opciones: OpcionesFetch = {},
): Promise<T> {
  const { params, ...opcionesRest } = opciones;

  // Construir URL con query params opcionales
  let url = `${urlBase}${ruta}`;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([, valor]) => valor !== undefined)
        .map(([clave, valor]) => [clave, String(valor)]),
    ).toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }
  }

  const respuesta = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...opcionesRest.headers,
    },
    ...opcionesRest,
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({
      message: 'Error desconocido',
    }));
    throw new Error(error.message ?? `Error HTTP ${respuesta.status}`);
  }

  // Retornar null para respuestas sin cuerpo (ej: 204 No Content)
  if (respuesta.status === 204) {
    return null as T;
  }

  return respuesta.json() as Promise<T>;
}

/**
 * Helpers para los métodos HTTP más comunes
 */
export const api = {
  get: <T>(ruta: string, params?: OpcionesFetch['params']) =>
    apiFetch<T>(ruta, { method: 'GET', params }),

  post: <T>(ruta: string, cuerpo: unknown) =>
    apiFetch<T>(ruta, {
      method: 'POST',
      body: JSON.stringify(cuerpo),
    }),

  patch: <T>(ruta: string, cuerpo: unknown) =>
    apiFetch<T>(ruta, {
      method: 'PATCH',
      body: JSON.stringify(cuerpo),
    }),

  delete: <T>(ruta: string) =>
    apiFetch<T>(ruta, { method: 'DELETE' }),
};
