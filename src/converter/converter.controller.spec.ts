import { Test, TestingModule } from '@nestjs/testing';
import { ConverterController } from './converter.controller';
import { ConvertService } from './convert.service';
import { ConvertDto } from './dtos';
import { DomainError } from './errors';

describe('ConverterController', () => {
  let converterController: ConverterController;
  let convertService: ConvertService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ConverterController],
      providers: [ConvertService],
    })
      .overrideProvider(ConvertService)
      .useValue({
        convertByCharCode: jest.fn(),
      })
      .compile();

    convertService = moduleRef.get<ConvertService>(ConvertService);
    converterController = moduleRef.get<ConverterController>(ConverterController);
  });

  describe('convert', () => {
    it('should return conversion result', async () => {
      const convertDto: ConvertDto = {
        source: 'USD',
        target: 'EUR',
        amount: 100,
        doubleConversion: true,
      };
      const result = { amount: 90, rate: 0.9, isDoubleConverted: true };

      jest.spyOn(convertService, 'convertByCharCode').mockImplementation(async () => result);

      expect(await converterController.convert(convertDto)).toEqual(result);
    });

    it('should return an error from DomainError', async () => {
      const convertDto: ConvertDto = {
        source: 'USD',
        target: 'EUR',
        amount: 100,
        doubleConversion: false,
      };
      const error = new DomainError('Conversion Error');

      jest.spyOn(convertService, 'convertByCharCode').mockImplementation(async () => {
        throw error;
      });

      expect(await converterController.convert(convertDto)).toEqual({ error: error.message });
    });

    it('should return a generic error for unexpected errors', async () => {
      const convertDto: ConvertDto = {
        source: 'USD',
        target: 'EUR',
        amount: 100,
        doubleConversion: false,
      };

      jest.spyOn(convertService, 'convertByCharCode').mockImplementation(async () => {
        throw new Error('Unexpected Error');
      });

      expect(await converterController.convert(convertDto)).toEqual({ error: 'Internal server error' });
    });
  });
});
