import { Module } from '@nestjs/common';
import { PsaService } from './psa.service';
import { ScpService } from './scp.service';

@Module({
  providers: [PsaService, ScpService],
  exports: [PsaService, ScpService],
})
export class AlgorithmModule {}
