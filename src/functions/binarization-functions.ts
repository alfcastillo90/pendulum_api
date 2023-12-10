import { Random } from 'random-js';

const random = new Random(); // Instancia global de Random

export const Standard = (step1: number): number => {
  const rand = random.real(0.0, 1.0);
  return rand <= step1 ? 1 : 0;
};

export const Complement = (step1: number, bin: number): number => {
  const rand = random.real(0.0, 1.0);
  if (rand <= step1) {
    return bin === 1 ? 0 : 1;
  }
  return bin;
};

export const ProbabilityStrategy = (step1: number, bin: number): number => {
  const alpha = 1 / 3;
  if (alpha < step1 && step1 <= (1 / 2) * (1 + alpha)) {
    return bin;
  }
  return step1 > (1 / 2) * (1 + alpha) ? 1 : bin;
};

export const Elitist = (step1: number, bestBin: number): number => {
  const rand = random.real(0.0, 1.0);
  return rand < step1 ? bestBin : 0;
};
