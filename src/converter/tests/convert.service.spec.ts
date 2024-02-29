import { Test, TestingModule } from '@nestjs/testing';
import { ConvertService } from '../application/services/convert.service';
import { RateService } from '../application/services/rate.service';
import { CurrencyService } from '../../currency/currency.service';
import { RateUpdaterService } from '../application/services/rate.updater.service';

describe('ConvertService', () => {
  let service: ConvertService;

  const rate = 123;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConvertService,
        {
          provide: RateService,
          useValue: { getRate: jest.fn((s, t, ce) => ({ rate: rate, isDoubleConverted: false })) },
        },
        { provide: RateUpdaterService, useValue: { isExists: jest.fn(() => true), forceUpdate: jest.fn() } },
        CurrencyService,
      ],
    }).compile();

    service = module.get<ConvertService>(ConvertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should convert by num code', async () => {
    const amount = 453;
    const result = await service.convertByNumCode(784, 971, amount);
    expect(result.amount).toBe(rate * amount);
    expect(result.rate).toBe(rate);
  });
  it('should not find currency by num code', async () => {
    const amount = 111;
    await expect(service.convertByNumCode(784, 0, amount)).rejects.toThrow();
    await expect(service.convertByNumCode(0, 0, amount)).rejects.toThrow();
    await expect(service.convertByNumCode(0, 784, amount)).rejects.toThrow();
  });
  it('should convert by char code', async () => {
    const amount = 987;
    const result = await service.convertByCharCode('USD', 'EUR', amount);
    expect(result.amount).toBe(rate * amount);
    expect(result.rate).toBe(rate);
  });
  it('should not find currency by char code', async () => {
    const amount = 111;
    await expect(service.convertByCharCode('ABC', 'USD', amount)).rejects.toThrow();
    await expect(service.convertByCharCode('EUR', 'XXX', amount)).rejects.toThrow();
    await expect(service.convertByCharCode('', 'AAAAA', amount)).rejects.toThrow();
  });
  it('should not find disabled currency', async () => {
    const amount = 111;
    await expect(service.convertByCharCode('ANG', 'EUR', amount, false)).rejects.toThrow();
    await expect(service.convertByCharCode('EUR', 'BBD', amount, false)).rejects.toThrow();
    await expect(service.convertByCharCode('RUB', 'BSD', amount, false)).rejects.toThrow();
  });
});
