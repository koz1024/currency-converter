import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyService],
    }).compile();
    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get base currency', () => {
    expect(service.getBaseCurrency()).toBeDefined();
  });

  it('should get currency by num code', () => {
    expect(service.getCurrencyByNumCode(840)).toBeDefined();
  });

  it('should get currency by char code', () => {
    expect(service.getCurrencyByCode('USD')).toBeDefined();
  });

  it('should not get currency by char code', () => {
    expect(service.getCurrencyByCode('XXX')).toBeUndefined();
  });

  it('should not get currency by num code', () => {
    expect(service.getCurrencyByNumCode(0)).toBeUndefined();
  });

  it('should not get disabled currency by num code', () => {
    expect(service.getCurrencyByNumCode(643)).toBeUndefined();
  });

  it('should not get disabled currency by char code', () => {
    expect(service.getCurrencyByCode('RUB')).toBeUndefined();
  });

  it('should get list of currencies', () => {
    const result = service.list();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should check currency format', () => {
    const result = service.list();
    expect(result).toBeDefined();
    result.map((currency) => {
      expect(currency.numCode).toBeDefined();
      expect(currency.numCode).toBeGreaterThan(0);
      expect(currency.code).toBeDefined();
      expect(currency.code).toHaveLength(3);
      expect(currency.name).toBeDefined();
    });
  });

  it('should tell that currency is not base', () => {
    const currency = service.getCurrencyByCode('USD');
    expect(service.isBaseCurrency(currency)).toBe(false);
  });

  it('should tell that currency is base', () => {
    const currency = service.getCurrencyByCode('UAH');
    expect(service.isBaseCurrency(currency)).toBe(true);
  });
});
