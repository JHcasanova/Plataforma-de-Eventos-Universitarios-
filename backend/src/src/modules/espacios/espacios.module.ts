import { Module } from '@nestjs/common';
import { EspaciosController } from './controller/espacios.controller';
import { EspaciosService } from './service/espacios.service';
import { EspaciosRepository } from './repository/espacios.repository';

/**
 * Módulo de Espacios: agrupa controller, service y repository
 * para la gestión de espacios físicos.
 */
@Module({
  controllers: [EspaciosController],
  providers: [EspaciosService, EspaciosRepository],
  exports: [EspaciosService],
})
export class EspaciosModule {}
