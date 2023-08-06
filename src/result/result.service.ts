// results.service.ts
import { Injectable } from '@nestjs/common';
import { PsaService } from '../algorithm/psa.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result } from '../schemas/result.schema';
import { CreateResultDto } from './result.dto';

@Injectable()
export class ResultService {
  constructor(
    private readonly psaService: PsaService,
    @InjectModel(Result.name) private readonly resultModel: Model<Result>,
  ) {}

  async create(createResultDto: CreateResultDto): Promise<Result> {
    const { dim, ps, maxIteration, lb, ub } = createResultDto;
    this.psaService.setParameters(dim, ps, maxIteration, lb, ub);
    const [bestFit, bestPos, cgCurve] = this.psaService.psaV2Func();

    const result = new this.resultModel({
      dim,
      ps,
      maxIteration,
      lb,
      ub,
      bestFit,
      bestPos,
      cgCurve,
    });

    return result.save();
  }
}
