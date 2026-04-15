import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { FacultadesModule } from './modules/facultades/facultades.module';
import { TiposEventoModule } from './modules/tipos-evento/tipos-evento.module';
import { EspaciosModule } from './modules/espacios/espacios.module';
import { PonentesModule } from './modules/ponentes/ponentes.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { EstudiantesModule } from './modules/estudiantes/estudiantes.module';
import { InscripcionesModule } from './modules/inscripciones/inscripciones.module';

/**
 * Módulo raíz de la aplicación.
 * Registra todos los módulos de la plataforma de eventos universitarios.
 */
@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({ isGlobal: true }),
    // Módulo Prisma compartido (global)
    PrismaModule,
    // Módulos de entidades base
    FacultadesModule,
    TiposEventoModule,
    EspaciosModule,
    PonentesModule,
    // Módulo de Eventos
    EventosModule,
    // Módulo de Estudiantes
    EstudiantesModule,
    // Módulo de Inscripciones (HU-04 y HU-05)
    InscripcionesModule,
  ],
})
export class AppModule {}
