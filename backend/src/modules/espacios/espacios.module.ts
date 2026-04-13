import { Module } from '@nestjs/common';
import { EspaciosController } from './controller/espacios.controller';
import { EspaciosService } from './service/espacios.service';

/**
 * Módulo de Espacios: agrupa controller y service para la gestión de espacios físicos.
 */
@Module({
  controllers: [EspaciosController],
  providers: [EspaciosService],
  exports: [EspaciosService],
})
export class EspaciosModule {}
