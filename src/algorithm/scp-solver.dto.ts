import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScpSolverDTO {
  @ApiProperty({ description: 'id', default: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Metaheuristica', default: 'PSA' })
  @IsString()
  mh: string;

  @IsNumber()
  maxIter: number;

  @IsNumber()
  pop: number;

  @IsString()
  instancia: string;

  @IsArray()
  DS: string[];

  @IsString()
  repairType: string;
}
