import nj from 'numjs';
import * as fs from 'fs';
import * as path from 'path';
import { order } from '../functions/order';
import { Random } from 'random-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScpService {
  private rows: number;
  private columns: number;
  private coverage: number[][];
  private cost: number[];
  private optimum: number;

  constructor(instance) {
    this.rows = 0;
    this.columns = 0;
    this.coverage = nj.array([]);
    this.cost = nj.array([]);
    this.optimum = 0;
    this.readInstance(instance);
  }

  getRows(): number {
    return this.rows;
  }

  getColumns(): number {
    return this.columns;
  }

  getCoverage(): nj.NdArray {
    return this.coverage;
  }

  getCost(): nj.NdArray {
    return this.cost;
  }

  getOptimum(): number {
    return this.optimum;
  }

  setRows(rows: number): void {
    this.rows = rows;
  }

  setColumns(columns: number): void {
    this.columns = columns;
  }

  setCoverage(coverage: number[][]): void {
    this.coverage = coverage;
  }

  setCost(cost: number[]): void {
    this.cost = cost;
  }

  setOptimum(optimum: number): void {
    this.optimum = optimum;
  }

  readInstance(instanceName: string): void {
    const dirSCP = path.join(
      __dirname,
      '..',
      'instancias',
      instanceName + '.txt',
    );
    this.optimum = this.getOptimumValueFromInstance(dirSCP); // Asegúrate de implementar obtenerOptimo

    const file = fs.readFileSync(dirSCP, 'utf8');
    const lines = file.split('\n');

    // Lectura de las dimensiones del problema
    const [rows, columns] = lines[0].split(' ').map(Number);
    this.setRows(rows);
    this.setColumns(columns);

    // Lectura de los costos
    const costs = [];
    let countDim = 1;
    for (let j = 1; j < lines.length && countDim <= this.getColumns(); j++) {
      const values = lines[j].split(' ').filter(Boolean);
      for (let i = 0; i < values.length; i++) {
        costs.push(parseInt(values[i]));
        countDim++;
      }
    }

    // Preparar matriz de restricciones (matriz A)
    const constrains = nj.zeros([rows, columns]).tolist();
    let row = 0;
    let currentLineIndex = countDim;

    while (currentLineIndex < lines.length && lines[currentLineIndex] !== '') {
      const numUnos = parseInt(lines[currentLineIndex]);
      currentLineIndex++;
      let countUnos = 0;

      while (currentLineIndex < lines.length && countUnos < numUnos) {
        const columns = lines[currentLineIndex]
          .split(' ')
          .filter(Boolean)
          .map((val) => parseInt(val) - 1);
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column < constrains[row].length) {
            constrains[row][column] = 1;
          }
          countUnos++;
        }
        currentLineIndex++;
      }
      row++;
    }

    // Setear la matriz de cobertura y los costos
    this.setCoverage(nj.array(constrains));
    this.setCost(nj.array(costs));
  }

  getOptimumValueFromInstance(instanceFileName: string): number | null {
    for (const instanceName in order) {
      if (order.hasOwnProperty(instanceName)) {
        if (instanceFileName.includes(instanceName)) {
          return order[instanceName][1];
        }
      }
    }

    return null;
  }

  feasibilityTest(solution) {
    let check = true;
    // Dot product entre la matriz de cobertura y la solución
    const validation = nj.dot(this.getCoverage(), solution);

    // Verificar si hay algún cero en el resultado
    if (validation.tolist().some((row) => row.includes(0))) {
      check = false;
      console.log(`Solución infactible: ${solution}`);
      console.log(`Motivo: ${validation}`);
    }

    return [check, validation];
  }

  fitness(solution: nj.NdArray): number {
    // Calcula el producto punto entre la solución y los costos
    return nj.dot(solution, this.getCost());

    // Retorna el valor resultante
    // Ten en cuenta que `nj.dot` devuelve un NdArray, por lo que puedes necesitar
    // convertirlo a un número simple, dependiendo de cómo estés manejando los datos.
    //return fitnessValue.get(0);
  }

  simpleRepair(solution: nj.NdArray): nj.NdArray {
    let repairs = 0;
    let indexes = Array.from(Array(this.getRows()).keys());
    const coverage = this.getCoverage();
    const costs = this.getCost();
    const random = new Random();
    indexes = random.shuffle(indexes);

    for (const i of indexes) {
      if (nj.dot(coverage.pick(i), solution).get(0) < 1) {
        const idx = coverage
          .pick(i)
          .tolist()
          .map((val, index) => (val > 0 ? index : -1))
          .filter((index) => index !== -1);
        console.log('columnas que satisfacen la restriccion', idx);
        // Encontrar el índice del costo más bajo
        const idxLowCost = idx.reduce((minIdx, currentIdx) =>
          costs.get(minIdx) < costs.get(currentIdx) ? minIdx : currentIdx,
        );
        console.log('indice del menor costo', idxLowCost);
        solution.set(idxLowCost, 1);
        repairs++;
        console.log('total de reparaciones realizadas', repairs);
      }
    }

    // Retorna la solución reparada
    return solution;
  }

  repairComplex(solution: nj.NdArray): nj.NdArray {
    const set = this.getCoverage();
    let [feasible, aux] = this.feasibilityTest(solution);
    const costs = this.getCost();
    let repairs = 0;

    while (!feasible) {
      const r_no_cubiertas = nj.zeros(this.getRows());

      // Actualizar las restricciones no cubiertas
      aux.tolist().forEach((val, idx) => {
        if (val === 0) {
          r_no_cubiertas.set(idx, 1);
        }
      });

      // Cantidad de restricciones no cubiertas que cubre cada columna
      const cnc = nj.dot(r_no_cubiertas, set);
      console.log('cantidad de restricciones no cubiertas', cnc.toString());
      // Trade-off entre zonas no cubiertas y costo de seleccionar cada columna
      const tradeOff = nj.divide(costs, cnc);
      console.log(
        'trade-off entre zonas no cubiertas y costo',
        tradeOff.toString(),
      );
      // Seleccionar la columna con el trade-off más bajo
      const idx = tradeOff.argmin().get(0);
      console.log('indice del menor trade-off', idx.toString());
      // Asignar 1 a esa columna
      solution.set(idx, 1);

      // Verificar si la solución actualizada es factible
      [feasible, aux] = this.feasibilityTest(solution);
      repairs++;
      console.log('total de reparaciones realizadas', repairs);
    }

    return solution;
  }

  repair(solution: nj.NdArray, repairType: string): nj.NdArray {
    if (repairType === 'simple') {
      solution = this.simpleRepair(solution);
    } else if (repairType === 'complex') {
      solution = this.repairComplex(solution);
    }

    return solution;
  }
}
