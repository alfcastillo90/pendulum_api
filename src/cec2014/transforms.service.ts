import { Injectable } from '@nestjs/common';

@Injectable()
export class TransformsService {
  shiftFunc(x: number[], Os: number[]): number[] {
    const xShift = [];
    for (let i = 0; i < x.length; i++) {
      xShift[i] = x[i] - Os[i];
    }
    return xShift;
  }

  rotateFunc(x: number[], Mr: number[][]): number[] {
    const xRot = new Array(x.length).fill(0);
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < x.length; j++) {
        xRot[i] += x[j] * Mr[i][j];
      }
    }
    return xRot;
  }

  sr_func(
    x: number[],
    Os: number[],
    Mr: number[][],
    sh_rate: number,
    s_flag: number,
    r_flag: number,
  ): number[] {
    let sr_x = [];
    let y = [];
    if (s_flag === 1) {
      if (r_flag === 1) {
        y = this.shiftFunc(x, Os);
        for (let i = 0; i < x.length; i++) {
          y[i] *= sh_rate;
        }
        sr_x = this.rotateFunc(y, Mr);
      } else {
        sr_x = this.shiftFunc(x, Os);
        for (let i = 0; i < x.length; i++) {
          sr_x[i] *= sh_rate;
        }
      }
    } else {
      if (r_flag === 1) {
        for (let i = 0; i < x.length; i++) {
          y[i] = x[i] * sh_rate;
        }
        sr_x = this.rotateFunc(y, Mr);
      } else {
        for (let i = 0; i < x.length; i++) {
          sr_x[i] = x[i] * sh_rate;
        }
      }
    }
    return sr_x;
  }
}
