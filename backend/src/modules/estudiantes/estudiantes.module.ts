import { Module } from '@nestjs/common';
import { EstudiantesController } from './controller/estudiantes.controller';
import { EstudiantesService } from './service/estudiantes.service';

/**
 * Módulo de Estudiantes: CRUD completo para la entidad Estudiante.
 */
@Module({
  controllers: [EstudiantesController],
  providers: [EstudiantesService],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}
