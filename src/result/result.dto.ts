import { IsNumber } from 'class-validator';

export class CreateResultDto {
  @IsNumber()
  dim: number;
  @IsNumber()
  ps: number;
  @IsNumber()
  maxIteration: number;
  @IsNumber()
  lb: number;
  @IsNumber()
  ub: number;
}
