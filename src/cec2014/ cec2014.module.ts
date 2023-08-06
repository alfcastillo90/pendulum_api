import { Module } from '@nestjs/common';
import { TransformsService } from './transforms.service';
import { RosenbrockService } from './rosenbrock.service';

@Module({
  providers: [TransformsService, RosenbrockService],
  exports: [TransformsService, RosenbrockService], // exportamos el servicio para que pueda ser usado por otros módulos
})
export class Cec2014Module {}
