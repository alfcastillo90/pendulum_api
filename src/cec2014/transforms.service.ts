import { Injectable } from '@nestjs/common';

@Injectable()
export class TransformsService {
  /**
   * Applies a shift operation in the search space.
   *
   * @param x - The current point in the search space.
   * @param xShift - The result of applying the shift operation is stored here.
   * @param nx - The number of dimensions in the search space.
   * @param Os - The shift vector. It represents the amount of shift in each dimension.
   */
  shiftFunc(x: number[], xShift: number[], nx: number, Os: number[]) {
    for (let i = 0; i < nx; i++) {
      xShift[i] = x[i] - Os[i];
    }
  }

  /**
   * Applies a rotation operation in the search space.
   *
   * @param x - The current point in the search space.
   * @param xRot - The result of applying the rotation operation is stored here.
   * @param nx - The number of dimensions in the search space.
   * @param Mr - The rotation matrix. It represents the rotation to apply.
   */
  rotateFunc(x: number[], xRot: number[], nx: number, Mr: number[]) {
    for (let i = 0; i < nx; i++) {
      xRot[i] = 0;
      for (let j = 0; j < nx; j++) {
        xRot[i] += x[j] * Mr[i * nx + j];
      }
    }
  }

  /**
   * Combines the shift and rotation operations.
   *
   * @param x - The current point in the search space.
   * @param srX - The result of applying the shift and/or rotation operations is stored here.
   * @param nx - The number of dimensions in the search space.
   * @param Os - The shift vector.
   * @param Mr - The rotation matrix.
   * @param shRate - A scaling factor applied to the shift.
   * @param sFlag - A binary value that determines whether to apply the shift operation. If sFlag is 1, apply shift. If it is 0, don't apply shift.
   * @param rFlag - A binary value that determines whether to apply the rotation operation. If rFlag is 1, apply rotation. If it is 0, don't apply rotation.
   */
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
