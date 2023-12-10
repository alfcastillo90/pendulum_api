// solver-scp.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ScpSolverService } from './scp-solver.service';

@Controller('solver-scp')
export class SolverScpController {
  constructor(private solverScpService: ScpSolverService) {}

  @Post()
  async solveScp(
    @Body('id') id: number,
    @Body('mh') mh: string,
    @Body('maxIter') maxIter: number,
    @Body('pop') pop: number,
    @Body('instancia') instancia: string,
    @Body('DS') DS: string[],
    @Body('repairType') repairType: string,
    @Res() response: Response,
  ) {
    try {
      await this.solverScpService.solverSCP(
        id,
        mh,
        maxIter,
        pop,
        instancia,
        DS,
        repairType,
      );
      response.status(200).send('SCP solved successfully.');
    } catch (error) {
      response.status(500).send('Error solving SCP: ' + error.message);
    }
  }
}
