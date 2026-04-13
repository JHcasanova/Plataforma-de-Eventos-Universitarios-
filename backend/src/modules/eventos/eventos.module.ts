import { Module } from '@nestjs/common';
import { EventosController } from './controller/eventos.controller';
import { EventosService } from './service/eventos.service';

/**
 * Módulo de Eventos: agrupa controller y service para la gestión de eventos universitarios.
 */
@Module({
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
})
export class EventosModule {}
