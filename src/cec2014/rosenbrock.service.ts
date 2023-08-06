import { Injectable } from '@nestjs/common';
import { TransformsService } from './transforms.service';

@Injectable()
export class RosenbrockService {
  constructor(private readonly transformsService: TransformsService) {} // inyectamos el servicio de transformación

  rosenbrockFunc(x: number[], f: number[], nx: number, Os: number[], Mr: number[], sFlag: number, rFlag: number) {
    let z = new Array(nx).fill(0);
    let tmp1: number, tmp2: number;
    f[0] = 0.0;

    z = this.transformsService.srFunc(x, nx, Os, Mr, 2.048/100.0, sFlag, rFlag);
    z[0] += 1.0;
    for (let i = 0; i < nx-1; i++) {
      z[i+1] += 1.0;
      tmp1 = z[i]*z[i] - z[i+1];
      tmp2 = z[i] - 1.0;
      f[0] += 100.0 * tmp1 * tmp1 + tmp2 * tmp2;
    }
    return f;
  }
}
