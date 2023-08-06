import { Injectable } from '@nestjs/common';

@Injectable()
export class TransformsService {
  shiftFunc(x: number[], xShift: number[], nx: number, Os: number[]) {
    for (let i = 0; i < nx; i++) {
      xShift[i] = x[i] - Os[i];
    }
  }

  rotateFunc(x: number[], xRot: number[], nx: number, Mr: number[]) {
    for (let i = 0; i < nx; i++) {
      xRot[i] = 0;
      for (let j = 0; j < nx; j++) {
        xRot[i] += x[j] * Mr[i * nx + j];
      }
    }
  }

  srFunc(
    x: number[],
    srX: number[],
    nx: number,
    Os: number[],
    Mr: number[],
    shRate: number,
    sFlag: number,
    rFlag: number,
  ) {
    const y = [];
    if (sFlag === 1) {
      if (rFlag === 1) {
        this.shiftFunc(x, y, nx, Os);
        for (let i = 0; i < nx; i++) {
          y[i] *= shRate;
        }
        this.rotateFunc(y, srX, nx, Mr);
      } else {
        this.shiftFunc(x, srX, nx, Os);
        for (let i = 0; i < nx; i++) {
          srX[i] *= shRate;
        }
      }
    } else {
      if (rFlag === 1) {
        for (let i = 0; i < nx; i++) {
          y[i] = x[i] * shRate;
        }
        this.rotateFunc(y, srX, nx, Mr);
      } else {
        for (let i = 0; i < nx; i++) {
          srX[i] = x[i] * shRate;
        }
      }
    }
  }
}
