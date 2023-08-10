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
    const { agents, maxIteration } = createResultDto;
    this.psaService.setParameters(agents, maxIteration);
    const {
      bestFitness,
      bestPosition,
      bestSolution,
      initialSolution,
      solutions,
    } = this.psaService.psaV2Func();

    const result = new this.resultModel({
      dimensions: this.psaService.dimensions,
      agents,
      maxIteration,
      lowerBound: this.psaService.lowerBoundary,
      upperBound: this.psaService.upperBoundary,
      bestFit: bestFitness,
      bestPos: bestPosition,
      bestSolution,
      initialSolution,
      solutions,
    });

    return result.save();
  }

  async findAll(): Promise<Result[]> {
    return this.resultModel.find().exec();
  }
}
