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

export interface ConvertResultInterface {
  amount: number;
  rate: number;
  isDoubleConverted: boolean;
}

export interface ConvertResultErrorInterface {
  error: string;
}
