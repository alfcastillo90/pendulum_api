import { Module } from '@nestjs/common';
import { PsaService } from './psa.service';
import { ScpService } from './scp.service';
import { PorcentajesService } from './porcentajes.service';

@Module({
  providers: [PsaService, ScpService, PorcentajesService],
  exports: [PsaService, ScpService, PorcentajesService],
})
export class AlgorithmModule {}
