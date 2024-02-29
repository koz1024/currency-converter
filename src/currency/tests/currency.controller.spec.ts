import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController, CurrencyDto } from '../currency.controller';
import { CurrencyService } from '../currency.service';

describe('CurrencyController', () => {
  let currencyController: CurrencyController;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [CurrencyService],
    })
      .overrideProvider(CurrencyService)
      .useValue({
        list: jest.fn(),
      })
      .compile();

    currencyService = moduleRef.get<CurrencyService>(CurrencyService);
    currencyController = moduleRef.get<CurrencyController>(CurrencyController);
  });

  describe('list', () => {
    it('should return an array of currencies', async () => {
      const result: CurrencyDto[] = [
        { code: 'USD', name: 'United States Dollar', numCode: 840, enabled: true },
        { code: 'EUR', name: 'Euro', numCode: 978, enabled: true },
      ];

      jest.spyOn(currencyService, 'list').mockImplementation(() => result);

      expect(currencyController.list()).toBe(result);
    });
  });
});
