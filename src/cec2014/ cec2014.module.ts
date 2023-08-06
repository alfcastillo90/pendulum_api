import { Module } from '@nestjs/common';
import { TransformsService } from './transforms.service';

@Module({
  providers: [TransformsService],
  exports: [TransformsService], // exportamos el servicio para que pueda ser usado por otros módulos
})
export class Cec2014Module {}
