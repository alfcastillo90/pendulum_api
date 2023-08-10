import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResultDocument = Result & Document;
export type Solution = {
  positions: number[];
  fitness: number;
};
@Schema()
export class Result {
  @Prop({ required: true })
  dimensions: number;

  @Prop({ required: true })
  agents: number;

  @Prop({ required: true })
  maxIteration: number;

  @Prop({ required: true })
  lowerBound: number;

  @Prop({ required: true })
  upperBound: number;

  @Prop({ required: true })
  bestFit: number;

  @Prop({ required: true })
  bestPos: number[];

  @Prop({
    required: true,
    type: Array<Solution>,
  })
  initialSolution: Solution[];

  @Prop({ required: true, type: Array })
  solutions: Array<any>;

  @Prop({ required: true, type: { positions: [Number], fitness: Number } })
  bestSolution: Solution;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
