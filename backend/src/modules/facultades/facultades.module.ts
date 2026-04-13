import { Module } from '@nestjs/common';
import { FacultadesController } from './controller/facultades.controller';
import { FacultadesService } from './service/facultades.service';

/**
 * Módulo de Facultades: agrupa controller y service para la gestión de facultades.
 */
@Module({
  controllers: [FacultadesController],
  providers: [FacultadesService],
  exports: [FacultadesService],
})
export class FacultadesModule {}
