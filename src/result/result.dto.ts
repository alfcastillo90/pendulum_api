import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Solution } from 'src/schemas/result.schema';

class NumberArray {
  @IsInt()
  eachNumber: number;
}

export class CreateResultDto {
  @ApiProperty({ description: 'Population size', default: 4 })
  @IsNumber()
  agents: number;

  @ApiProperty({ description: 'Max iterations', default: 100 })
  @IsNumber()
  maxIteration: number;

  @ApiProperty({
    description: 'Cost associated with each set',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  cost: number[];

  @ApiProperty({
    description: 'Matrix describing which elements are covered by each set',
    type: [[Number]],
  })
  @IsArray()
  @ArrayNotEmpty()
  coverageMatrix: number[][];
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
