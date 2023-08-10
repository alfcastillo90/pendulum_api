import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResultDto {
  @ApiProperty({ description: 'Population size', default: 4 })
  @IsNumber()
  agents: number;

  @ApiProperty({ description: 'Max iterations', default: 100 })
  @IsNumber()
  maxIteration: number;
}

export class GetResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bestFitness: number;

  @ApiProperty({ type: [Number] })
  bestPosition: number[];

  @ApiProperty({ type: [Number] })
  cgCurve: number[];
}
