import { Module } from '@nestjs/common';
import { InscripcionesController } from './controller/inscripciones.controller';
import { InscripcionesService } from './service/inscripciones.service';
import { InscripcionesRepository } from './repository/inscripciones.repository';

/**
 * Módulo de Inscripciones: agrupa controller, service y repository
 * para HU-04 (inscribirse) y HU-05 (cancelar inscripción).
 */
@Module({
  controllers: [InscripcionesController],
  providers: [InscripcionesService, InscripcionesRepository],
  exports: [InscripcionesService],
})
export class InscripcionesModule {}
