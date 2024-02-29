export class DomainError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CurrencyNotFoundError extends DomainError {
  constructor() {
    super(`Selected currency has not been found`);
  }
}

export class ExternalCurrencyNotFoundError extends DomainError {
  constructor() {
    super(`Currency has not been found in the Monobank API`);
  }
}

export class DoubleConversionDisabledError extends DomainError {
  constructor() {
    super(`Double conversion is disabled`);
  }
}

export class AmountError extends DomainError {
  constructor() {
    super(`Amount should be greater than 0`);
  }
}
