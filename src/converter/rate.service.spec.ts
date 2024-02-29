import { RateService } from './rate.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from '../currency/currency.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

describe('RateService', () => {
  let service: RateService;
  let currencySvc: CurrencyService;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        CurrencyService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<RateService>(RateService);
    currencySvc = module.get<CurrencyService>(CurrencyService);
    cache = module.get(CACHE_MANAGER);
    // jest.spyOn(cache, 'get').mockRejectedValue({ buy: 38.45, sell: 39.99, cross: 51.23 });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get direct rate (buy USD for UAH)', async () => {
    const baseCurrency = currencySvc.getBaseCurrency();
    const targetCurrency = currencySvc.getCurrencyByNumCode(840);
    jest.spyOn(cache, 'get').mockResolvedValueOnce({ buy: 38.45, sell: 39.99 });
    const result = await service.getRate(baseCurrency, targetCurrency, false);
    expect(result.rate).toBe(1 / 39.99);
    expect(result.isDoubleConverted).toBe(false);
  });

  it('should get direct rate (to buy UAH for USD)', async () => {
    const sourceCurrency = currencySvc.getCurrencyByNumCode(840);
    const baseCurrency = currencySvc.getBaseCurrency();
    jest.spyOn(cache, 'get').mockResolvedValueOnce({ buy: 38.45, sell: 39.99 });
    const result = await service.getRate(sourceCurrency, baseCurrency, false);
    expect(result.rate).toBe(38.45);
    expect(result.isDoubleConverted).toBe(false);
  });

  it('should get direct rate (cross; to buy PLN for UAH', async () => {
    const baseCurrency = currencySvc.getBaseCurrency();
    const targetCurrency = currencySvc.getCurrencyByNumCode(985);
    jest.spyOn(cache, 'get').mockResolvedValueOnce({ cross: 9.45 });
    const result = await service.getRate(baseCurrency, targetCurrency, false);
    expect(result.rate).toBe(1 / 9.45);
    expect(result.isDoubleConverted).toBe(false);
  });

  it('should not allow double conversion', async () => {
    const sourceCurrency = currencySvc.getCurrencyByNumCode(840);
    const targetCurrency = currencySvc.getCurrencyByNumCode(978);
    await expect(service.getRate(sourceCurrency, targetCurrency, false)).rejects.toThrow();
  });

  it('should get double conversion rate', async () => {
    const sourceCurrency = currencySvc.getCurrencyByNumCode(840);
    const targetCurrency = currencySvc.getCurrencyByNumCode(978);
    jest.spyOn(cache, 'get').mockResolvedValue({ cross: 38.45 });
    const result = await service.getRate(sourceCurrency, targetCurrency);
    expect(result.rate).toBe(1); // 38.45 * (1 / 38.45) - since both rates are the same
    expect(result.isDoubleConverted).toBe(true);
  });
});
