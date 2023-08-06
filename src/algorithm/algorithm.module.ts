import { Module } from '@nestjs/common';
import { PsaService } from './psa.service';

@Module({
  providers: [PsaService],
  exports: [PsaService],
})
export class AlgorithmModule {}
