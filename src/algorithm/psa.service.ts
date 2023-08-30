import { Injectable } from '@nestjs/common';
import { Solution } from 'src/schemas/result.schema';

@Injectable()
export class PsaService {
  // Definición de propiedades
  private agents: number;
  private cost: number[];
  private isCovered: number[][];
  private maxIteration: number;
  private objectiveFunction: (x: number[]) => number;

  public dimensions: number;
  public lowerBoundary: number;
  public upperBoundary: number;

  constructor() {
    // Inicializar las variables según la función objetivo y los parámetros requeridos
    // Estos valores de ejemplo se pueden modificar según tu necesidad
    this.setObjectiveFunction();
    this.dimensions = 2;
    this.agents = 4;
    this.maxIteration = 100;
    this.lowerBoundary = 0;
    this.upperBoundary = 1;
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

  // Define la función objetivo para Set Covering
  private setObjectiveFunction(): void {
    this.objectiveFunction = (x: number[]) => {
      let totalCost = 0;
      const covered = new Set<number>();
      for (let i = 0; i < x.length; i++) {
        if (x[i] > 0.5) {
          // Si el conjunto i es seleccionado en la solución
          totalCost += this.cost[i];
          for (let j = 0; j < this.isCovered[i].length; j++) {
            if (this.isCovered[i][j] === 1) {
              covered.add(j);
            }
          }
        }
      }
      // Añadir una penalización si no todos los elementos son cubiertos
      if (covered.size !== this.isCovered[0].length) {
        totalCost += 1000 * (this.isCovered[0].length - covered.size);
      }
      return totalCost;
    };
  }

  // Nuevo método para actualizar los parámetros de la búsqueda del péndulo
  public setParameters(
    agents: number,
    maxIteration: number,
    cost: number[],
    isCovered: number[][],
  ): void {
    this.agents = agents;
    this.cost = cost;
    this.isCovered = isCovered;
    this.maxIteration = maxIteration;
    this.dimensions = cost.length;
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
}
