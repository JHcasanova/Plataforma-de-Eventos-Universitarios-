import { Module } from '@nestjs/common';
import { EventosController } from './controller/eventos.controller';
import { EventosService } from './service/eventos.service';
import { EventosRepository } from './repository/eventos.repository';

/**
 * Módulo de Eventos: agrupa controller, service y repository
 * para la gestión de eventos universitarios.
 */
@Module({
  controllers: [EventosController],
  providers: [EventosService, EventosRepository],
  exports: [EventosService],
})
export class EventosModule {}
