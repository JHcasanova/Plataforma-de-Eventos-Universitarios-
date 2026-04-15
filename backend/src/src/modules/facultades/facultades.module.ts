import { Module } from '@nestjs/common';
import { FacultadesController } from './controller/facultades.controller';
import { FacultadesService } from './service/facultades.service';
import { FacultadesRepository } from './repository/facultades.repository';

/**
 * Módulo de Facultades: agrupa controller, service y repository para la gestión de facultades.
 */
@Module({
  controllers: [FacultadesController],
  providers: [FacultadesService, FacultadesRepository],
  exports: [FacultadesService],
})
export class FacultadesModule {}
