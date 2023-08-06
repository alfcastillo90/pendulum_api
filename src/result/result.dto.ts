import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResultDto {
  @ApiProperty({ description: 'Dimension of the problem', default: 2 })
  @IsNumber()
  dim: number;

  @ApiProperty({ description: 'Population size', default: 20 })
  @IsNumber()
  ps: number;

  @ApiProperty({ description: 'Max iterations', default: 1000 })
  @IsNumber()
  maxIteration: number;

  @ApiProperty({ description: 'Lower bound', default: -100 })
  @IsNumber()
  lb: number;

  @ApiProperty({ description: 'Upper bound', default: 100 })
  @IsNumber()
  ub: number;
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
