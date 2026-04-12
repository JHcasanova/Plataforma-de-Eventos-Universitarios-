import { Module } from '@nestjs/common';
import { PonentesController } from './controller/ponentes.controller';
import { PonentesService } from './service/ponentes.service';

/**
 * Módulo de Ponentes: agrupa controller y service para la gestión de ponentes.
 */
@Module({
  controllers: [PonentesController],
  providers: [PonentesService],
  exports: [PonentesService],
})
export class PonentesModule {}