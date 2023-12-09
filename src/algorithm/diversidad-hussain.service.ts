// diversidad-hussain.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiversidadService {
  calcularDiversidadHussain(matriz: number[][]): number {
    const medianas: number[] = [];
    const n = matriz.length;
    const l = matriz[0].length;

    for (let j = 0; j < l; j++) {
      let suma = 0;
      for (let i = 0; i < n; i++) {
        suma += matriz[i][j];
      }
      medianas.push(suma / n);
    }

    let diversidad = 0;
    for (let d = 0; d < l; d++) {
      let div_d = 0;
      for (let i = 0; i < n; i++) {
        div_d += Math.abs(medianas[d] - matriz[i][d]);
      }
      diversidad += div_d;
    }

    return parseFloat(((1 / (l * n)) * diversidad).toFixed(3));
  }
}
