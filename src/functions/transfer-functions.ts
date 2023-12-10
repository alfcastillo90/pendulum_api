function erf(x) {
  // constants
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  // Save the sign of x
  let sign = 1;
  if (x < 0) {
    sign = -1;
  }
  x = Math.abs(x);

  // A&S formula 7.1.26
  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

export const S1 = (dimension: number): number => {
  return 1 / (1 + Math.exp(-2 * dimension));
};

export const S2 = (dimension: number): number => {
  return 1 / (1 + Math.exp(-dimension));
};

export const S3 = (dimension: number): number => {
  return 1 / (1 + Math.exp(-dimension / 2));
};

export const S4 = (dimension: number): number => {
  return 1 / (1 + Math.exp(-dimension / 3));
};

export const V1 = (dimension: number): number => {
  return Math.abs(erf((Math.sqrt(Math.PI) / 2) * dimension));
};

export const V2 = (dimension: number): number => {
  return Math.abs(Math.tanh(dimension));
};

export const V3 = (dimension: number): number => {
  return Math.abs(dimension / Math.sqrt(1 + dimension * dimension));
};

export const V4 = (dimension: number): number => {
  return Math.abs((2 / Math.PI) * Math.atan((Math.PI / 2) * dimension));
};

export const X1 = (dimension: number): number => {
  return 1 / (1 + Math.exp(2 * dimension));
};

export const X2 = (dimension: number): number => {
  return 1 / (1 + Math.exp(dimension));
};

export const X3 = (dimension: number): number => {
  return 1 / (1 + Math.exp(dimension / 2));
};

export const X4 = (dimension: number): number => {
  return 1 / (1 + Math.exp(dimension / 3));
};

export const Z1 = (dimension: number): number => {
  return Math.pow(1 - Math.pow(2, dimension), 0.5);
};

export const Z2 = (dimension: number): number => {
  return Math.pow(1 - Math.pow(5, dimension), 0.5);
};

export const Z3 = (dimension: number): number => {
  return Math.pow(1 - Math.pow(8, dimension), 0.5);
};

export const Z4 = (dimension: number): number => {
  return Math.pow(1 - Math.pow(20, dimension), 0.5);
};
