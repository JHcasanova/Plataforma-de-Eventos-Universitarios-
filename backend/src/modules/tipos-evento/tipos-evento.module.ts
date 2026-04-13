import { Module } from '@nestjs/common';
import { TiposEventoController } from './controller/tipos-evento.controller';
import { TiposEventoService } from './service/tipos-evento.service';

/**
 * Módulo de Tipos de Evento: agrupa controller y service para la gestión de categorías de eventos.
 */
@Module({
  controllers: [TiposEventoController],
  providers: [TiposEventoService],
  exports: [TiposEventoService],
})
export class TiposEventoModule {}
