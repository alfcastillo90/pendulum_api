import * as fs from 'fs';
import * as path from 'path';
import * as nj from 'numjs';
import { DiversidadService } from './diversidad-hussain.service';
import { PorcentajesService } from './porcentajes.service';
import { PsaService } from './psa.service';
import { ScpService } from './scp.service';
import { TransferAndBinarizationService } from './transfer-and-binarization.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScpSolverService {
  constructor(
    private scpService: ScpService,
    private diversidadService: DiversidadService,
    private porcentajesService: PorcentajesService,
    private transferAndBinarizationService: TransferAndBinarizationService,
    private psaService: PsaService,
  ) {}

  async solverSCP(
    id: number,
    mh: string,
    maxIter: number,
    pop: number,
    instancia: string,
    DS: string[],
    repairType: string,
  ): Promise<void> {
    // Código para solverSCP aquí
    // ...
    const dirResult = path.join(__dirname, 'Resultados');
    this.scpService.readInstance(instancia);

    const initialTime = Date.now();
    const tiempoInicializacion1 = Date.now();

    console.log(
      '------------------------------------------------------------------------------------------------------',
    );
    console.log('instancia SCP a resolver: ' + instancia);

    const resultsPath = path.join(
      dirResult,
      `${mh}_${instancia.split('.')[0]}_${id}.csv`,
    );
    const results = fs.createWriteStream(resultsPath);
    results.write('iter,fitness,time,XPL,XPT,DIV\n');

    // Genero una población inicial binaria
    const columns = this.scpService.getColumns(); // Obtenido desde scpService
    let poblacion = nj.random([pop, columns]).multiply(2).floor();

    // Calculo la diversidad inicial
    let maxDiversidad = this.diversidadService.calcularDiversidadHussain(
      poblacion.tolist(),
    );
    let [XPL, XPT, state] = this.porcentajesService.calcularPorcentajesXLPXPT(
      maxDiversidad,
      maxDiversidad,
    );

    const fitness = nj.zeros(pop);
    let solutionsRanking = nj.zeros(pop);

    // Calculo de factibilidad de cada individuo y calculo del fitness inicial
    for (let i = 0; i < poblacion.shape[0]; i++) {
      const individuo = poblacion.pick(i);
      const [flag, aux] = this.scpService.feasibilityTest(individuo);

      if (!flag) {
        // Solución infactible
        const repaired = this.scpService.repair(individuo, repairType);
        poblacion.assign(repaired, i);
      }

      fitness.set(i, this.scpService.fitness(individuo));
    }

    solutionsRanking = nj.argsort(fitness);

    // Determino mi mejor solución y la guardo
    const bestRowAux = solutionsRanking.get(0);
    let Best = poblacion.pick(bestRowAux).clone();
    let BestFitness = fitness.get(bestRowAux);

    // Copio la población para su uso posterior
    let matrixBin = poblacion.clone();

    // Capturo el tiempo al final de la inicialización
    const tiempoInicializacion2 = Date.now();
    // Dentro del método solverSCP

    // ...

    // Mostrar el fitness inicial y otros detalles
    console.log(
      '------------------------------------------------------------------------------------------------------',
    );
    console.log(`fitness inicial: ${fitness.toString()}`);
    console.log(`Best fitness inicial: ${BestFitness}`);
    console.log(
      '------------------------------------------------------------------------------------------------------',
    );
    console.log(
      `COMIENZA A TRABAJAR LA METAHEURISTICA ${mh} / Binarizacion: ${DS} / Reparacion: ${repairType}`,
    );
    console.log(
      '------------------------------------------------------------------------------------------------------',
    );
    console.log(
      `iteracion: 0, best: ${BestFitness}, mejor iter: ${fitness.get(
        solutionsRanking.get(0),
      )}, peor iter: ${fitness.get(
        solutionsRanking.get(pop - 1),
      )}, optimo: ${this.scpService.getOptimum()}, time (s): ${(
        (tiempoInicializacion2 - tiempoInicializacion1) /
        1000
      ).toFixed(3)}, XPT: ${XPT}, XPL: ${XPL}, DIV: ${maxDiversidad}`,
    );

    // Escribir en el archivo de resultados
    results.write(
      `0,${BestFitness},${(
        (tiempoInicializacion2 - tiempoInicializacion1) /
        1000
      ).toFixed(3)},${XPL},${XPT},${maxDiversidad}\n`,
    );

    // Continuar con el resto de la lógica de la función...
    // Dentro del método solverSCP

    // ...

    // Bucle principal de iteraciones
    for (let iter = 0; iter < maxIter; iter++) {
      const timerStart = Date.now();

      // Perturbar la población con la metaheurística (usando PsaService)
      poblacion = this.psaService.iterarPSA(
        maxIter,
        iter,
        this.scpService.getColumns(),
        poblacion.tolist(),
        Best.tolist(),
      );

      // Binarizar y calcular la factibilidad y fitness de cada individuo
      for (let i = 0; i < poblacion.shape[0]; i++) {
        const individuo = poblacion.pick(i);
        poblacion.assign(
          this.transferAndBinarizationService.applyBinarization(
            individuo.tolist(),
            DS[0],
            DS[1],
            Best,
            matrixBin.pick(i).tolist(),
          ),
          i,
        );
        const [flag, aux] = this.scpService.feasibilityTest(individuo);

        if (!flag) {
          // Solución infactible
          poblacion.assign(this.scpService.repair(individuo, repairType), i);
        }

        fitness.set(i, this.scpService.fitness(individuo));
      }

      // Actualización del ranking y conservación del mejor
      const newSolutionsRanking = nj.argsort(fitness);
      if (fitness.get(newSolutionsRanking.get(0)) < BestFitness) {
        BestFitness = fitness.get(newSolutionsRanking.get(0));
        Best = poblacion.pick(newSolutionsRanking.get(0)).clone();
      }
      matrixBin = poblacion.clone();

      // Cálculo de la diversidad y actualización de XPL y XPT
      const div_t = this.diversidadService.calcularDiversidadHussain(
        poblacion.tolist(),
      );
      if (maxDiversidad < div_t) {
        maxDiversidad = div_t;
      }
      [XPL, XPT, state] = this.porcentajesService.calcularPorcentajesXLPXPT(
        div_t,
        maxDiversidad,
      );

      // Registro de tiempo y escritura de resultados
      const timerFinal = Date.now();
      const timeEjecuted = (timerFinal - timerStart) / 1000;
      console.log(
        `iteracion: ${
          iter + 1
        }, best: ${BestFitness}, mejor iter: ${fitness.get(
          newSolutionsRanking.get(0),
        )}, peor iter: ${fitness.get(
          newSolutionsRanking.get(pop - 1),
        )}, optimo: ${this.scpService.getOptimum()}, time (s): ${timeEjecuted.toFixed(
          3,
        )}, XPT: ${XPT}, XPL: ${XPL}, DIV: ${div_t}`,
      );
      results.write(
        `${iter + 1},${BestFitness},${timeEjecuted.toFixed(
          3,
        )},${XPL},${XPT},${div_t}\n`,
      );
    }

    // Cierre y limpieza final
    console.log(
      '------------------------------------------------------------------------------------------------------',
    );
    console.log(`Best fitness: ${BestFitness}`);
    console.log(`Cantidad de columnas seleccionadas: ${Best.sum()}`);
    console.log(
      '------------------------------------------------------------------------------------------------------',
    );
    const finalTime = Date.now();
    const tiempoEjecucion = (finalTime - initialTime) / 1000;
    console.log(`Tiempo de ejecucion (s): ${tiempoEjecucion}`);
    results.close();

    // Eliminación del archivo de resultados si es necesario
    fs.unlinkSync(resultsPath);

    // Continuar con el resto de la lógica si es necesario...
  }
}
