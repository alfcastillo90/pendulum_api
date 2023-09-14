import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Solution } from 'src/schemas/result.schema';

export class CreateResultDto {
  @ApiProperty({ description: 'Population size', default: 4 })
  @IsNumber()
  agents: number;

  @ApiProperty({ description: 'Max iterations', default: 100 })
  @IsNumber()
  maxIteration: number;
}

export class GetResultDto {
  dimensions: number;
  agents: number;
  maxIteration: number;
  lowerBound: number;
  upperBound: number;
  bestFit: number;
  bestPos: number[];
  initialSolution: Solution[];
  solutions: Array<any>;
  bestSolution: Solution;
}
