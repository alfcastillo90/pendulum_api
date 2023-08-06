import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlgorithmModule } from 'src/algorithm/algorithm.module';
import { ResultSchema, Result } from 'src/schemas/result.schema';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';

@Module({
  imports: [
    AlgorithmModule,
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
  ],
  providers: [ResultService],
  controllers: [ResultController],
})
export class ResultModule {}
