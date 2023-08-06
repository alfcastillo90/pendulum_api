import { Injectable } from '@nestjs/common';

@Injectable()
export class PsaService {
  // Definición de propiedades
  private fobj: (x: number[]) => number;
  private dim: number;
  private ps: number;
  private maxIteration: number;
  private lb: number;
  private ub: number;

  constructor() {
    // Inicializar las variables según la función objetivo y los parámetros requeridos
    // Estos valores de ejemplo se pueden modificar según tu necesidad
    this.fobj = (x) => Math.pow(x[0], 2) + Math.pow(x[1], 2); // Ejemplo de función objetivo
    this.dim = 2;
    this.ps = 20;
    this.maxIteration = 1000;
    this.lb = -100;
    this.ub = 100;
  }

  // Nuevo método para actualizar los parámetros de la búsqueda del péndulo
  public setParameters(
    dim: number,
    ps: number,
    maxIteration: number,
    lb: number,
    ub: number,
  ) {
    this.dim = dim;
    this.ps = ps;
    this.maxIteration = maxIteration;
    this.lb = lb;
    this.ub = ub;
  }

  // Método para inicializar la población dentro de los límites lb y ub
  private initialization(): number {
    return this.lb + Math.random() * (this.ub - this.lb);
  }

  // Implementación de la función Pendulum Search Algorithm
  public psaV2Func(): [number, number[], number[]] {
    // Inicializar X con valores aleatorios dentro de los límites
    const X = Array.from({ length: this.ps }, () =>
      Array.from({ length: this.dim }, () => this.initialization()),
    );

    // Calcular el fitness inicial para cada posición
    let fit = X.map((x) => this.fobj(x));

    // Inicializar el mejor fitness y la mejor posición
    let xBest = [...X[0]];
    let bestFit = fit[0];

    // Guardar el mejor fitness en la curva cg
    const cgCurve = [bestFit];

    // Encontrar el mejor fitness y la mejor posición en la población inicial
    for (let i = 1; i < this.ps; i++) {
      if (fit[i] < bestFit) {
        xBest = [...X[i]];
        bestFit = fit[i];
      }
    }

    // Bucle de iteraciones
    for (let i = 1; i < this.maxIteration; i++) {
      // Actualizar cada posición
      for (let p = 0; p < this.ps; p++) {
        for (let d = 0; d < this.dim; d++) {
          // Calcular el valor pend
          const pend =
            2 *
            Math.exp(-i / this.maxIteration) *
            Math.cos(2 * Math.PI * Math.random());

          // Actualizar la posición
          X[p][d] += pend * (xBest[d] - X[p][d]);

          // Si la posición está fuera de los límites, inicializar de nuevo
          if (X[p][d] > this.ub || X[p][d] < this.lb) {
            X[p][d] = this.initialization();
          }
        }
      }

      // Calcular el nuevo fitness
      fit = X.map((x) => this.fobj(x));

      // Encontrar el mejor fitness y la mejor posición
      for (let p = 0; p < this.ps; p++) {
        if (fit[p] < bestFit) {
          xBest = [...X[p]];
          bestFit = fit[p];
        }
      }

      // Guardar el mejor fitness en la curva cg
      cgCurve.push(bestFit);
    }

    // Devolver el mejor fitness, la mejor posición y la curva cg
    return [bestFit, xBest, cgCurve];
  }
}
