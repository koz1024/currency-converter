export interface RateCacheInterface {
  buy: number;
  sell: number;
  cross: number;
  date: number;
}

export interface RateInterface {
  rate: number;
  isDoubleConverted: boolean;
}
