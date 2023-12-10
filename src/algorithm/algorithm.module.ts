import { Module } from '@nestjs/common';
import { PsaService } from './psa.service';
import { ScpService } from './scp.service';
import { PorcentajesService } from './porcentajes.service';
import { TransferAndBinarizationService } from './transfer-and-binarization.service';

@Module({
  providers: [
    PsaService,
    PorcentajesService,
    ScpService,
    TransferAndBinarizationService,
  ],
  exports: [
    PsaService,
    PorcentajesService,
    ScpService,
    TransferAndBinarizationService,
  ],
})
export class AlgorithmModule {}
