// results/result.schema.ts

import { Schema, Document } from 'mongoose';

export interface Result extends Document {
  funcNumber: number;
  bestScore: number;
  bestPos: number[];
  cgCurve: number[];
}

export const ResultSchema = new Schema({
  funcNumber: { type: Number, required: true },
  bestScore: { type: Number, required: true },
  bestPos: { type: [Number], required: true },
  cgCurve: { type: [Number], required: true },
});
