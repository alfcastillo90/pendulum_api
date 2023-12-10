// transfer-and-binarization.service.ts
import { Injectable } from '@nestjs/common';
import * as nj from 'numjs';
import { Random } from 'random-js';
import {
  Complement,
  Elitist,
  Standard,
  ProbabilityStrategy,
} from 'src/functions/binarization-functions';
import {
  S1,
  S2,
  S3,
  S4,
  V1,
  V2,
  V3,
  V4,
  X1,
  X2,
  X3,
  X4,
  Z1,
  Z2,
  Z3,
  Z4,
} from 'src/functions/transfer-functions';

@Injectable()
export class TransferAndBinarizationService {
  // Aquí puedes agregar las funciones de transferencia y binarización
  // transferir, aplicarBinarizacion, binarizar
  // ...

  // Ejemplo de implementación de una función
  applyBinarization(
    ind: number[],
    transferFunction: string,
    binarizationFunction: string,
    bestSolutionBin: number[],
    indBin: number[],
  ): nj.NdArray {
    const individuoBin = new Array(ind.length).fill(0);

    for (let i = 0; i < ind.length; i++) {
      const step1 = this.transfer(transferFunction, ind[i]);
      individuoBin[i] = this.binarize(
        binarizationFunction,
        step1,
        bestSolutionBin[i],
        indBin[i],
      );
    }
    return nj.array(individuoBin);
  }

  binarize(
    binarizationFunction: string,
    step1: number,
    bestSolutionBin: number,
    indBin: number,
  ): number {
    switch (binarizationFunction) {
      case 'STD':
        return Standard(step1);
      case 'COM':
        return Complement(step1, indBin);
      case 'PS':
        return ProbabilityStrategy(step1, indBin);
      case 'ELIT':
        return Elitist(step1, bestSolutionBin);
      default:
        return 0; // O un valor por defecto adecuado
    }
  }

  transfer = (transferFunction: string, dimension: number): number => {
    const transferFunctions: { [key: string]: (dim: number) => number } = {
      S1: S1,
      S2: S2,
      S3: S3,
      S4: S4,
      V1: V1,
      V2: V2,
      V3: V3,
      V4: V4,
      X1: X1,
      X2: X2,
      X3: X3,
      X4: X4,
      Z1: Z1,
      Z2: Z2,
      Z3: Z3,
      Z4: Z4,
    };

    const func = transferFunctions[transferFunction];
    return func ? func(dimension) : 0; // Retorna 0 o algún valor por defecto si la función no existe
  };
}
