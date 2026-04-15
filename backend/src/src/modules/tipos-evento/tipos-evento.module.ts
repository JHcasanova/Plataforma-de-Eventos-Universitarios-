import { Module } from '@nestjs/common';
import { TiposEventoController } from './controller/tipos-evento.controller';
import { TiposEventoService } from './service/tipos-evento.service';
import { TiposEventoRepository } from './repository/tipos-evento.repository';

/**
 * Módulo de Tipos de Evento: agrupa controller, service y repository
 * para la gestión de categorías de eventos.
 */
@Module({
  controllers: [TiposEventoController],
  providers: [TiposEventoService, TiposEventoRepository],
  exports: [TiposEventoService],
})
export class TiposEventoModule {}
