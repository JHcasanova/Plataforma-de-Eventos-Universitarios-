import { Module } from '@nestjs/common';
import { PonentesController } from './controller/ponentes.controller';
import { PonentesService } from './service/ponentes.service';
import { PonentesRepository } from './repository/ponentes.repository';

/**
 * Módulo de Ponentes: agrupa controller, service y repository
 * para la gestión de ponentes.
 */
@Module({
  controllers: [PonentesController],
  providers: [PonentesService, PonentesRepository],
  exports: [PonentesService],
})
export class PonentesModule {}
