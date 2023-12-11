// solver-scp.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ScpSolverService } from './scp-solver.service';
import { ScpSolverDTO } from './scp-solver.dto';

@Controller('solver-scp')
export class SolverScpController {
  constructor(private solverScpService: ScpSolverService) {}

  @Post()
  async solveScp(@Body() body: ScpSolverDTO, @Res() response: Response) {
    try {
      await this.solverScpService.solverSCP(
        body.id,
        body.mh,
        body.maxIter,
        body.pop,
        body.instancia,
        body.DS,
        body.repairType,
      );
      response.status(200).send('SCP solved successfully.');
    } catch (error) {
      response.status(500).send('Error solving SCP: ' + error.message);
    }
  }
}
