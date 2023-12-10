import { Module } from '@nestjs/common';
import { PsaService } from './psa.service';
import { ScpService } from './scp.service';
import { PorcentajesService } from './porcentajes.service';
import { TransferAndBinarizationService } from './transfer-and-binarization.service';
import { DiversidadService } from './diversidad-hussain.service';
import { ScpSolverService } from './scp-solver.service';

@Module({
  providers: [
    DiversidadService,
    PsaService,
    PorcentajesService,
    ScpService,
    TransferAndBinarizationService,
    ScpSolverService,
  ],
  exports: [
    DiversidadService,
    PsaService,
    PorcentajesService,
    ScpService,
    TransferAndBinarizationService,
    ScpSolverService,
  ],
})
export class AlgorithmModule {}
