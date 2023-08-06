// results.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateResultDto } from './result.dto';
import { Result } from '../schemas/result.schema';
import { ResultService } from './result.service';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  create(@Body() createResultDto: CreateResultDto): Promise<Result> {
    return this.resultService.create(createResultDto);
  }
}
