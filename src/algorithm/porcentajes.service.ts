// porcentajes.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class PorcentajesService {
  calcularPorcentajesXLPXPT(
    div: number,
    maxDiv: number,
  ): [number, number, number] {
    const XPL = parseFloat(((div / maxDiv) * 100).toFixed(2));
    const XPT = parseFloat(
      ((Math.abs(div - maxDiv) / maxDiv) * 100).toFixed(2),
    );
    let state = -1;

    if (XPL >= XPT) {
      state = 1; // Exploración
    } else {
      state = 0; // Explotación
    }

    return [XPL, XPT, state];
  }
}
