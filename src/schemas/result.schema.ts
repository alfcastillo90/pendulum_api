import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema()
export class Result {
  @Prop({ required: true })
  dim: number;

  @Prop({ required: true })
  ps: number;

  @Prop({ required: true })
  maxIteration: number;

  @Prop({ required: true })
  lb: number;

  @Prop({ required: true })
  ub: number;

  @Prop({ required: true })
  bestFit: number;

  @Prop({ required: true })
  bestPos: number[];

  @Prop({ required: true })
  cgCurve: number[];
}

export const ResultSchema = SchemaFactory.createForClass(Result);
