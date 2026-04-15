import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Módulo Prisma global: exporta PrismaService para que cualquier
 * módulo de la aplicación pueda inyectarlo sin importar PrismaModule.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
