/* eslint-disable no-var */
import { Injectable } from '@nestjs/common';
import { Solution } from 'src/schemas/result.schema';
import { Random } from 'random-js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
var nj = require('numjs');
@Injectable()
export class PsaService {
  // Definición de propiedades
  private objectiveFunction: (x: number[]) => number;
  public dimensions: number;
  private agents: number;
  private maxIteration: number;
  public lowerBoundary: number;
  public upperBoundary: number;
  private random = new Random();

  constructor() {
    // Inicializar las variables según la función objetivo y los parámetros requeridos
    // Estos valores de ejemplo se pueden modificar según tu necesidad
    this.objectiveFunction = (x) =>
      Math.pow(x[0], 2) + Math.pow(x[1], 2) + Math.pow(x[2], 2);

    this.dimensions = 3;
    this.agents = 4;
    this.maxIteration = 100;
    this.lowerBoundary = -100;
    this.upperBoundary = 100;
  }

  // Nuevo método para actualizar los parámetros de la búsqueda del péndulo
  public setParameters(agents: number, maxIteration: number) {
    this.agents = agents;
    this.maxIteration = maxIteration;
  }

  private initializeMatrix(agents, dim, lb, ub) {
    const matrix = [];

    for (let i = 0; i < agents; i++) {
      const row = [];

      for (let j = 0; j < dim; j++) {
        const randomValue = lb + (ub - lb) * Math.random();
        row.push(randomValue);
      }

      matrix.push(row);
    }

    return matrix;
  }

  // Implementación de la función Pendulum Search Algorithm
  public psaV2Func(): {
    bestFitness;
    bestPosition;
    cgCurve;
    initialSolution;
    bestSolution;
    solutions;
  } {
    const solutions = [];
    // Inicializar X con valores aleatorios dentro de los límites
    const positions = this.initializeMatrix(
      this.agents,
      this.dimensions,
      this.lowerBoundary,
      this.upperBoundary,
    );

    // Calcular el fitness inicial para cada posición
    let fitness = positions.map((x) => {
      return this.objectiveFunction(x);
    });

    // Inicializar el mejor fitness y la mejor posición
    let bestPosition = [...positions[0]];
    let bestFitness = fitness[0];
    // Guardar el mejor fitness en la curva cg
    const cgCurve = [];
    const initialSolution: any[] = [];
    // Encontrar el mejor fitness y la mejor posición en la población inicial
    for (let i = 0; i < this.agents; i++) {
      if (fitness[i] < bestFitness) {
        bestPosition = [...positions[i]];
        bestFitness = fitness[i];
      }
    }

    initialSolution.push({
      positions: JSON.parse(JSON.stringify(positions)),
      fitness,
    });

    // Bucle de iteraciones
    for (let i = 0; i < this.maxIteration; i++) {
      // Bucle de soluciones
      for (let p = 0; p < this.agents; p++) {
        // Bucle de dimensiones
        for (let d = 0; d < this.dimensions; d++) {
          // Calcular el valor pend
          const pend =
            2 *
            Math.exp(-i / this.maxIteration) *
            Math.cos(2 * Math.PI * Math.random());

          // Actualizar la posición
          positions[p][d] += pend * (bestPosition[d] - positions[p][d]);

          // Si la posición está fuera de los límites, inicializar de nuevo
          // validamos las restricciones
          positions[p][d] =
            positions[p][d] > this.upperBoundary
              ? this.upperBoundary
              : positions[p][d];
          positions[p][d] =
            positions[p][d] < this.lowerBoundary
              ? this.lowerBoundary
              : positions[p][d];
        }
      }

      // Calcular el nuevo fitness
      fitness = positions.map((x) => this.objectiveFunction(x));
      const currentPositions = JSON.parse(JSON.stringify(positions));
      const currentFitness = JSON.parse(JSON.stringify(fitness));

      solutions.push({ positions: currentPositions, fitness: currentFitness });
      // Encontrar el mejor fitness y la mejor posición
      for (let p = 0; p < this.agents; p++) {
        if (fitness[p] < bestFitness) {
          bestPosition = [...positions[p]];
          bestFitness = fitness[p];
        }
      }
    }
    const bestSolution: Solution = {
      positions: bestPosition,
      fitness: bestFitness,
    };

    return {
      bestFitness,
      bestPosition,
      cgCurve,
      initialSolution,
      bestSolution,
      solutions,
    };
  }

  public iterarPSA(maximaIteracion, t, dimension, poblacion, mejorSolucion) {
    for (let i = 0; i < poblacion.length; i++) {
      for (let j = 0; j < dimension; j++) {
        const rand = this.random.real(0, 1);
        const pend =
          2 * Math.exp(-t / maximaIteracion) * Math.cos(2 * Math.PI * rand);
        poblacion[i][j] =
          poblacion[i][j] + pend * (mejorSolucion[j] - poblacion[i][j]);
      }
    }

    return nj.array(poblacion);
  }
}
