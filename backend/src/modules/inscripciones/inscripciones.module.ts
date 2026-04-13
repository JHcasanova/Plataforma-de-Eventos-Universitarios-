import { Module } from '@nestjs/common';
import { InscripcionesController } from './controller/inscripciones.controller';
import { InscripcionesService } from './service/inscripciones.service';

/**
 * Módulo de Inscripciones: gestiona HU-04 (inscribirse) y HU-05 (cancelar inscripción).
 */
@Module({
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
  exports: [InscripcionesService],
})
export class InscripcionesModule {}
