import { Module } from '@nestjs/common';
import { EstudiantesController } from './controller/estudiantes.controller';
import { EstudiantesService } from './service/estudiantes.service';
import { EstudiantesRepository } from './repository/estudiantes.repository';

/**
 * Módulo de Estudiantes: agrupa controller, service y repository
 * para el CRUD completo de la entidad Estudiante.
 */
@Module({
  controllers: [EstudiantesController],
  providers: [EstudiantesService, EstudiantesRepository],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}
